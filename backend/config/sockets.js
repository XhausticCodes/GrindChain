import { Server } from "socket.io";
import User from "../models/User.js";

const connectToSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);

    socket.on("joinGroup", async ({ groupID, username }) => {
      socket.join(groupID);
      console.log(`${username} joined group ${groupID}`);
      
      try {
        const currUser = await User.findOneAndUpdate(
          { username: username },
          { 
            $set: { 
              // Use a different field for simple group IDs
              currentGroupId: groupID,
              // Keep groups array for actual Group ObjectIds
              // groups: [] // Don't modify this unless you have actual Group documents
            }
          },
          { new: true }
        );

        if (currUser) {
          console.log(`User ${username} successfully joined group ${groupID}`);
        } else {
          console.error("User not found or failed to update groups");
        }
      } catch (error) { 
        console.error("Error joining group:", error);
      }
      
      socket.to(groupID).emit("userJoined", { username, groupID });
    });

    socket.on("sendMessage", ({ groupID, ...messageData }) => {
      console.log(
        `Message from ${messageData.sender} in group ${groupID}: ${messageData.message}`
      );

      io.to(groupID).emit("receiveMessage", messageData);
    });

    socket.on("taskCompleted", async ({ taskID, groupID, username }) => {
      try {
        const currUser = await User.findOneAndUpdate(
          { username: username, "tasks._id": taskID },
          { $set: { "tasks.$.completed": true } },
          { new: true }
        );

        if (!currUser) {
          return socket.emit("task-completion-error", {
            error: "User or task not found",
          });
        }
      } catch (e) {
        console.error(e);
        socket.emit("task-update-error", {
          error: "Server error while updating task",
        });
      }

      socket.to(groupID).emit("taskCompleted", { taskID, username });
    });

    socket.on("disconnect", () => {
      console.log("A User Disconnected", socket.id);
    });
  });

  return io;
};

export default connectToSockets;