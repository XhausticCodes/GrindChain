import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectToSockets from './config/sockets.js';
import authRoutes from "./routes/auth.js";
import geminiRoutes from "./routes/gemini.js";
import groupRoutes from "./routes/groups.js";

const PORT = process.env.PORT || 5001;
const URL = process.env.MONGODB_URI;

const app = express();
const server = createServer(app);
const io = connectToSockets(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-requested-with",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods"
    ]
  })
);

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/ai', geminiRoutes);
app.use('/api/groups', groupRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
    }
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "GrindChain Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      ai: "/api/ai",
      health: "/api/health"
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Single database connection and server start
mongoose
  .connect(URL)
  .then(() => {
    server.listen(PORT, () => {
      // Server started successfully
    });
    console.log(`Server is running on port ${PORT}`);
  })
  
  .catch((err) => {
    console.error("Database connection failed:", err);
  });