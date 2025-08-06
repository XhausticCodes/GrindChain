import { Server } from "socket.io";
import User from "../models/User.js";
import Group from "../models/Group.js";
import mongoose from "mongoose";

// Helper function to check database connection
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Helper function to handle database errors gracefully
const handleDatabaseOperation = async (operation, fallback = null) => {
  try {
    if (!isDatabaseConnected()) {
      console.warn("Database not connected, using fallback behavior");
      return fallback;
    }
    return await operation();
  } catch (error) {
    if (error.name === "MongoServerSelectionError" || error.name === "MongoNetworkError") {
      console.error("Database connection error in socket operation:", error.message);
      return fallback;
    }
    throw error; // Re-throw non-connection errors
  }
};

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
              message: "User not found or not updated from updatedUser",
            });
            await newGroup.save();

        console.log(newGroup._id);
        return callback({ success: true, groupId: newGroup.joinCode });
      } catch (error) {
        console.error("Error creating group:", error);
        return callback({ success: false, message: "Server error" });
      }
    });

    socket.on("joinGroup", async ({ groupID, username }) => {
      socket.join(groupID);
      console.log(`${username} joined group ${groupID}`);

      const result = await handleDatabaseOperation(
        async () => {
          const currUser = await User.findOneAndUpdate(
            { username: username },
            { $set: { currentGroupId: groupID } },
            { new: true }
          );

          if (currUser) {
            console.log(`User ${username} successfully joined group ${groupID}`);
            return true;
          } else {
            console.error("User not found or failed to update groups");
            return false;
          }
        },
        false // fallback value when database is unavailable
      );

      if (!result && isDatabaseConnected()) {
        console.error("Failed to update user group membership in database");
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
