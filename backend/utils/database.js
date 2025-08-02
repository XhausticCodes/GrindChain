import mongoose from 'mongoose';

// Database connection utilities
export const checkDatabaseConnection = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const state = mongoose.connection.readyState;
  return {
    state,
    status: states[state] || 'unknown',
    isConnected: state === 1
  };
};

export const waitForDatabaseConnection = async (timeoutMs = 10000) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Database connection timeout'));
    }, timeoutMs);

    const checkConnection = () => {
      const connection = checkDatabaseConnection();
      
      if (connection.isConnected) {
        clearTimeout(timeout);
        resolve(true);
      } else if (connection.state === 0) { // disconnected
        clearTimeout(timeout);
        resolve(false);
      } else {
        // Still connecting, check again
        setTimeout(checkConnection, 100);
      }
    };

    checkConnection();
  });
};

export const reconnectDatabase = async () => {
  const connection = checkDatabaseConnection();
  
  if (connection.isConnected) {
    console.log('✅ Database already connected');
    return true;
  }
  
  console.log('🔄 Attempting to reconnect to database...');
  
  try {
    if (connection.state === 0) { // disconnected
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        retryReads: true,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000
      });
    }
    
    // Wait for connection to be established
    await waitForDatabaseConnection(15000);
    
    console.log('✅ Database reconnected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database reconnection failed:', error.message);
    return false;
  }
};

export const safeDbOperation = async (operation, fallbackValue = null) => {
  try {
    const connection = checkDatabaseConnection();
    
    if (!connection.isConnected) {
      console.warn('⚠️ Database not connected, attempting reconnection...');
      const reconnected = await reconnectDatabase();
      
      if (!reconnected) {
        console.warn('⚠️ Database unavailable, using fallback value');
        return fallbackValue;
      }
    }
    
    return await operation();
  } catch (error) {
    if (error.name === 'MongoServerSelectionError' || 
        error.name === 'MongoNetworkError' ||
        error.name === 'MongooseError' ||
        error.message.includes('ECONNRESET') ||
        error.message.includes('before initial connection')) {
      console.error('🔌 Database connection error:', error.message);
      console.warn('⚠️ Using fallback value due to connection issues');
      return fallbackValue;
    }
    
    // Re-throw non-connection errors
    throw error;
  }
};

export default {
  checkDatabaseConnection,
  waitForDatabaseConnection,
  reconnectDatabase,
  safeDbOperation
};
