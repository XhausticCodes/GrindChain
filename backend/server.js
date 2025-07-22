import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectToSockets from './config/sockets.js';
import authRoutes from "./routes/auth.js"

const PORT = process.env.PORT || 5000;
const URL = process.env.MONGODB_URI;

const app = express();
const server = createServer(app);
const io = connectToSockets(server);


app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["*"],
  })
);
app.use(express.json({limit: "40KB"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));
app.use(cookieParser());
app.use('/api/auth', authRoutes);


mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to Database");

    server.listen(PORT, () => {
      console.log(`server is listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });


// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve("../frontend/dist")));
  
  // Catch-all handler for frontend routes
  app.get("*", (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    return res.sendFile(path.resolve("../frontend/dist/index.html"));
  });
} else {
  // Development route
  app.get("/", (req, res) => {
    res.json({
      message: "GrindChain Backend API",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        health: "/api/health"
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});