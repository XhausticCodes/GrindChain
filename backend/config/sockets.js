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

    socket.on("joinGroup", ({ groupID, username }) => {
      socket.join(groupID);
      console.log(`${username} joined group ${groupID}`);
      socket.to(groupID).emit("userJoined", { username, groupID });
    });

    socket.on("sendMessage", ({ groupID, message, username }) => {
      console.log(`Message from ${username} in group ${groupID}: ${message}`);
      io.to(groupID).emit("receiveMessage", { message, username });
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
    });

    socket.on("disconnect", () => {
      console.log("A User Disconnected", socket.id);
    });
  });
};

export default connectToSockets;