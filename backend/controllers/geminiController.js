import GeminiService from '../services/geminiService.js';
import User from '../models/User.js';

const geminiService = new GeminiService();

const geminiController = {

generateTask: async (req, res) => {
  try {
    const { taskDescription, duration } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }

    if (!taskDescription || taskDescription.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Task description is required (minimum 5 characters)"
      });
    }

    const result = await geminiService.generateTaskWithRoadmap(taskDescription, duration || "2 weeks", userId);

    res.json({
      success: true,
      message: "Task with roadmap generated successfully",
      data: result
    });

  } catch (error) {
    console.error('Task generation error:', error);
    
    // More specific error messages
    let errorMessage = "Failed to generate task";
    if (error.message.includes("Invalid JSON")) {
      errorMessage = "AI response formatting error. Please try again.";
    } else if (error.message.includes("User not found")) {
      errorMessage = "User session expired. Please log in again.";
    } else if (error.message.includes("GEMINI_API_KEY")) {
      errorMessage = "AI service configuration error.";
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
},

  getTasks: async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required"
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        data: { tasks: user.tasks || [] }
      });

    } catch (error) {
      console.error('Get tasks error:', error);
      
      res.status(500).json({
        success: false,
        message: "Failed to fetch tasks",
        error: error.message
      });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required"
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);
      await user.save();

      res.json({
        success: true,
        message: "Task deleted successfully"
      });

    } catch (error) {
      console.error('Delete task error:', error);
      
      res.status(500).json({
        success: false,
        message: "Failed to delete task",
        error: error.message
      });
    }
  }
};

export default geminiController;