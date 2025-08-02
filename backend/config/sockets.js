import { Server } from "socket.io";
import User from "../models/User.js";
import Group from "../models/Group.js";

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

    socket.on("createGroup", async ({ groupData, userId }, callback) => {
      const { name, description, avatar, admin } = groupData;
      if (!name || !description) {
        return callback({ success: false, message: "Missing required fields" });
      }

      try {
        const newGroup = new Group({
          name,
          description,
          avatar,
          admin,
          joinCode: Math.random().toString(36).substring(2, 8),
        });
        await newGroup.save();

        // try{
        //   const currUser = await User.findById(userId);
        //   if(!currUser) return callback({success: true, message: "what the fuck is going on here"})
        // } catch (e) {
        //   return callback({success: false, message: "what the fuck is goin on here +1"});
        // }

        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { isAdmin: true, admin: true, currentGroupId: newGroup.joinCode },
            { new: true }
          );
          if (!updatedUser) {
            return callback({
              success: false,
              message: "User not found or not updated",
            });
          }
        } catch (err) {
          callback({ success: false, message: "Error updating user" });
        }

        console.log(newGroup._id);
        return callback({ success: true, groupId: newGroup._id });
      } catch (error) {
        console.error("Error creating group:", error);
        return callback({ success: false, message: "Server error" });
      }
    });

    socket.on("joinGroup", async ({ groupID, username }) => {
      socket.join(groupID);
      console.log(`${username} joined group ${groupID}`);

      try {
        const currUser = await User.findOneAndUpdate(
          { username: username },
          {
            $set: {
              currentGroupId: groupID,
            },
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
