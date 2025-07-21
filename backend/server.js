const http = require("http");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  }
});

// Connect to database
connectDB();


app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
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

server.listen(port, () => {
  console.log(`Server started at port: ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});