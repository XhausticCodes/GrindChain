import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validateSignupData, validateLoginData } from "../utils/validation.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const authController = {
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const validation = validateSignupData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }],
      });

      if (existingUser) {
        const field =
          existingUser.email === email.toLowerCase() ? "email" : "username";
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`,
        });
      }

      const user = new User({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
      });
      await user.save();

      const token = generateToken(user._id);

      res.cookie("token", token, cookieOptions);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: { ...user.toObject() },
      });
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`,
        });
      }

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const validation = validateLoginData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user._id);

      res.cookie("token", token, cookieOptions);

      res.json({
        success: true,
        message: "Login successful",
        user: { ...user.toObject() },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  logout: (req, res) => {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "Logout successful",
    });
  },

  getMe: async (req, res) => {
    try {
      const user = req.user;

      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          description: user.description,
          streak: user.streak,
          lastCheckinDate: user.lastCheckinDate,
          groups: user.groups,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  checkAuth: async (req, res) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.json({
          success: false,
          authenticated: false,
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        res.clearCookie("token");
        return res.json({
          success: false,
          authenticated: false,
        });
      }

      // Streak Logic
      const now = new Date();
      const lastCheckIn = new Date(user.lastVisited || 0);

      const hoursPassed = (now - lastCheckIn) / (1000 * 60 * 60);
      if (hoursPassed >= 24 && hoursPassed < 48) {
        user.streak += 1;
        user.streakChanged = 1; // 1 for change
        user.lastVisited = now;
      } else if (hoursPassed > 48) {
        user.streak = 0;
        user.streakChanged = 0; // 0 for reset
        user.lastVisited = now;
      } else if (hoursPassed < 24) {
        user.streakChanged = 2; // 2 for no change
      }

      await user.save();

      res.json({
        success: true,
        authenticated: true,
        streakChanged: user.streakChanged,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          groupID: user.currentGroupId,
          avatar: user.avatar,
          description: user.description,
          streak: user.streak,
          lastVisited: user.lastVisited,
          lastCheckinDate: user.lastCheckinDate,
          groups: user.groups,
          currentGroupId: user.currentGroupId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          isActive: user.isActive,
          tasks: user.tasks,
          checkinHistory: user.checkinHistory,
        },
      });
    } catch (error) {
      res.clearCookie("token");
      res.json({
        success: false,
        authenticated: false,
      });
      console.error("Auth check error:", error);
    }
  },

  updateMe: async (req, res) => {
    try {
      const user = req.user;
      const { description, avatar } = req.body;

      if (typeof description === "string") {
        user.description = description;
      }
      if (typeof avatar === "string") {
        user.avatar = avatar;
      }

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          description: user.description,
          streak: user.streak,
          lastCheckinDate: user.lastCheckinDate,
          groups: user.groups,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  },

  clearCurrentGroup: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          currentGroupId: null,
          $pull: { groups: { $exists: true } } // Remove all group references
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Current group cleared successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          description: user.description,
          currentGroupId: user.currentGroupId,
          groups: user.groups,
        },
      });
    } catch (error) {
      console.error("Clear current group error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to clear current group",
      });
    }
  },
};

export default authController;