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
import { mockApiEndpoints } from './utils/mockData.js';
import { checkDatabaseConnection, reconnectDatabase } from './utils/database.js';

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
  const dbConnection = checkDatabaseConnection();
  
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    services: {
      database: dbConnection.status,
      dbReadyState: dbConnection.state,
      dbConnected: dbConnection.isConnected,
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      server: 'running'
    },
    env: {
      port: PORT,
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  });
});

// Database reconnection endpoint
app.post('/api/reconnect-db', async (req, res) => {
  try {
    const success = await reconnectDatabase();
    const connection = checkDatabaseConnection();
    
    res.json({
      success,
      message: success ? 'Database reconnected successfully' : 'Failed to reconnect database',
      connection: {
        status: connection.status,
        isConnected: connection.isConnected
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error attempting database reconnection',
      error: error.message
    });
  }
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

// Enhanced database connection with better error handling and retry logic
const connectDatabase = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(URL, {
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10 seconds
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      // Remove bufferCommands: false to prevent the error
      // bufferCommands: false, // Disable mongoose buffering
      // bufferMaxEntries: 0 // Disable mongoose buffering
    });
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB Atlas');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔐 Mongoose connection closed due to application termination');
      process.exit(0);
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Atlas connection failed:', err.message);
    console.log('🔄 Starting server in offline mode...');
    console.log('📝 To fix this issue, you can:');
    console.log('   1. Add your IP address to MongoDB Atlas whitelist');
    console.log('   2. Check your MONGODB_URI in .env file');
    console.log('   3. Ensure your MongoDB Atlas cluster is running');
    console.log('   4. Try restarting your internet connection');
    return false;
  }
};

// Start server with or without database
const startServer = async () => {
  const dbConnected = await connectDatabase();
  
  // Add mock endpoints if database is offline
  if (!dbConnected) {
    console.log('🔧 Setting up mock API endpoints for offline development...');
    
    // Mock endpoints for testing
    app.get('/api/groups/current', (req, res) => {
      console.log('📝 Mock: getCurrentGroup called');
      mockApiEndpoints['/api/groups/current'](req, res);
    });
    
    app.get('/api/groups/current/:groupId', (req, res) => {
      console.log('📝 Mock: getCurrentGroup called with groupId:', req.params.groupId);
      mockApiEndpoints['/api/groups/current'](req, res);
    });
    
    app.put('/api/groups/:groupId', (req, res) => {
      console.log('📝 Mock: updateGroup called with:', req.body);
      mockApiEndpoints['/api/groups/update'](req, res);
    });
    
    app.delete('/api/groups/:groupId/leave', (req, res) => {
      console.log('📝 Mock: leaveGroup called');
      mockApiEndpoints['/api/groups/leave'](req, res);
    });
    
    app.get('/api/auth/check', (req, res) => {
      console.log('📝 Mock: auth check called');
      mockApiEndpoints['/api/auth/check'](req, res);
    });
    
    app.post('/api/auth/login', (req, res) => {
      console.log('📝 Mock: login called with:', req.body.email);
      res.json({
        success: true,
        user: {
          _id: 'user1',
          username: req.body.email?.split('@')[0] || 'DemoUser',
          email: req.body.email || 'demo@example.com',
          avatar: 'https://via.placeholder.com/48',
          groupID: 'DEMO123'
        },
        token: 'mock-jwt-token'
      });
    });
  }
  
  // Add middleware to check database status for real endpoints
  app.use('/api', (req, res, next) => {
    if (!dbConnected && !req.path.includes('/health')) {
      // For non-mock endpoints, check if database operations are needed
      const dbRequiredPaths = ['/auth/register']; // Only block registration when DB is down
      const requiresDB = dbRequiredPaths.some(path => req.path.startsWith(path));
      
      if (requiresDB) {
        return res.status(503).json({
          success: false,
          message: 'Database service unavailable. Please check MongoDB connection.',
          error: 'SERVICE_UNAVAILABLE'
        });
      }
    }
    next();
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Frontend URL: http://localhost:5173`);
    console.log(`🔗 Backend URL: http://localhost:${PORT}`);
    console.log(`💾 Database: ${dbConnected ? 'Connected' : 'Offline Mode'}`);
    console.log(`🧪 Mock Data: ${dbConnected ? 'Disabled' : 'Enabled'}`);
  });
};

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});