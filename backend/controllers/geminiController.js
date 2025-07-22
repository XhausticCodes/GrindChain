import GeminiService from '../services/geminiService.js';


const geminiService = new GeminiService();

const geminiController = {
  generateRoadmap: async (req, res) => {
    try {
      const { task, duration } = req.body;

      if (!task || task.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Task description is required (minimum 5 characters)"
        });
      }

  
      const result = await geminiService.generateRoadmap(task, duration);

      res.json({
        success: true,
        message: "Roadmap generated successfully",
        data: result
      });

    } catch (error) {
      console.error('Roadmap generation error:', error);
      
      res.status(500).json({
        success: false,
        message: "Failed to generate roadmap",
        error: error.message
      });
    }
  }
};

export default geminiController;