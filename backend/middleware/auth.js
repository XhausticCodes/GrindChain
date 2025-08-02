import jwt from "jsonwebtoken"
import User from "../models/User.js";
import mongoose from "mongoose";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Check if database is connected before making queries
    if (mongoose.connection.readyState !== 1) {
      console.warn("Database not connected, skipping user verification");
      // In offline mode, trust the JWT token
      req.user = { 
        _id: decoded.userId, 
        isActive: true,
        username: decoded.username || 'offline-user',
        email: decoded.email || 'offline@example.com'
      };
      return next();
    }

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found or inactive.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    // Handle MongoDB connection errors
    if (error.name === "MongoServerSelectionError" || error.name === "MongoNetworkError") {
      console.error("Auth check error:", error.name, error.message);
      // In case of database issues, trust the JWT token if it's valid
      try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = { 
          _id: decoded.userId, 
          isActive: true,
          username: decoded.username || 'offline-user',
          email: decoded.email || 'offline@example.com'
        };
        return next();
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          message: "Invalid token and database unavailable.",
        });
      }
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default auth;
