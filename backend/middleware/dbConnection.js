import { checkDatabaseConnection, waitForDatabaseConnection } from '../utils/database.js';

// Middleware to ensure database is connected before processing auth requests
export const ensureDatabaseConnection = async (req, res, next) => {
  try {
    const connection = checkDatabaseConnection();
    
    if (connection.isConnected) {
      return next();
    }
    
    if (connection.state === 2) { // connecting
      console.log('⏳ Database is connecting, waiting...');
      try {
        await waitForDatabaseConnection(10000); // Wait up to 10 seconds
        return next();
      } catch (error) {
        console.error('⏰ Database connection timeout');
        return res.status(503).json({
          success: false,
          message: 'Database connection timeout. Please try again later.',
          code: 'DATABASE_TIMEOUT'
        });
      }
    }
    
    // Database is disconnected
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      code: 'DATABASE_UNAVAILABLE'
    });
    
  } catch (error) {
    console.error('Database connection check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
      code: 'DATABASE_ERROR'
    });
  }
};

export default ensureDatabaseConnection;
