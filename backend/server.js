import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');

import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectToSockets from './config/sockets.js';
import authRoutes from "./routes/auth.js";
import geminiRoutes from "./routes/gemini.js";

const PORT = process.env.PORT || 5001;
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
app.use('/api/auth', authRoutes);
app.use('/api/ai', geminiRoutes);

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

console.log('Database URL:', URL ? 'Configured' : 'Missing');
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? 'Configured' : 'Missing');

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to Database");

    server.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
      console.log(`API Endpoints:`);
      console.log(`  - Auth: /api/auth`);
      console.log(`  - AI Roadmap: POST /api/ai/roadmap`);
      console.log(`  - Health Check: GET /api/health`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});