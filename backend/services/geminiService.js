import { GoogleGenAI } from "@google/genai";
import axios from 'axios';

class GeminiService {
  constructor() {
    this.ai = null;
    this.initialized = false;
    

    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  initialize() {
    if (this.initialized) return;
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
    
    this.ai = new GoogleGenAI({
      apiKey: apiKey
    });
    this.initialized = true;
  }

  async generateRoadmap(task, duration = "2 weeks") {
    try {
      this.initialize();
      
      const prompt = `
Create a detailed step-by-step roadmap for this task:

Task: ${task}
Duration: ${duration}

Please provide:
1. A clear breakdown of the task
2. Weekly schedule with specific goals
3. Daily action items for the first week
4. Key milestones to track progress
5. What features to build i.e. projects

Format with clear headings and bullet points. Make it actionable and motivating.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      return {
        success: true,
        roadmap: response.text,
        task,
        duration,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to generate roadmap: ${error.message}`);
    }
  }


}

export default GeminiService;