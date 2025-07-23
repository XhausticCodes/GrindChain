import { GoogleGenAI } from "@google/genai";
import axios from 'axios';
import User from '../models/User.js';

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

  async generateTaskWithRoadmap(taskDescription, duration = "2 weeks", userId) {
    try {
      this.initialize();
      
      // Smart duration detection from task description
      let detectedDuration = duration; // Default to passed duration (2 weeks)
      const taskLower = taskDescription.toLowerCase();
      
      // Check for duration patterns in the user's prompt
      const durationPatterns = [
        { pattern: /(\d+)\s*day[s]?/i, multiplier: 1, unit: 'day' },
        { pattern: /(\d+)\s*week[s]?/i, multiplier: 7, unit: 'week' },
        { pattern: /(\d+)\s*month[s]?/i, multiplier: 30, unit: 'month' },
        { pattern: /(one|1)\s*week/i, value: '1 week' },
        { pattern: /(two|2)\s*week[s]?/i, value: '2 weeks' },
        { pattern: /(three|3)\s*week[s]?/i, value: '3 weeks' },
        { pattern: /(four|4)\s*week[s]?/i, value: '4 weeks' },
        { pattern: /(one|1)\s*month/i, value: '1 month' },
        { pattern: /(two|2)\s*month[s]?/i, value: '2 months' },
        { pattern: /(three|3)\s*month[s]?/i, value: '3 months' },
      ];

      // Check each pattern
      for (const { pattern, value, multiplier, unit } of durationPatterns) {
        const match = taskLower.match(pattern);
        if (match) {
          if (value) {
            detectedDuration = value;
          } else if (multiplier && unit) {
            const number = match[1];
            if (unit === 'day') {
              detectedDuration = `${number} ${number === '1' ? 'day' : 'days'}`;
            } else if (unit === 'week') {
              detectedDuration = `${number} ${number === '1' ? 'week' : 'weeks'}`;
            } else if (unit === 'month') {
              detectedDuration = `${number} ${number === '1' ? 'month' : 'months'}`;
            }
          }
          break; // Use first match found
        }
      }

      console.log(`Original duration: ${duration}, Detected duration: ${detectedDuration}`);
      
      const prompt = `
Create a comprehensive task with roadmap for: "${taskDescription}"
Duration: ${detectedDuration}

Provide a JSON response with:
{
  "title": "Clear, concise task title",
  "description": "Detailed description of what needs to be accomplished",
  "priority": "low/medium/high",
  "roadmap": "• Week 1:\\n  • Day 1-2: Setup and initial planning\\n  • Day 3-5: Core development\\n  • Day 6-7: Testing and review\\n• Week 2:\\n  • Day 1-3: Refinement and optimization\\n  • Day 4-5: Final testing\\n  • Day 6-7: Deployment and documentation\\n\\nKey Milestones:\\n• Milestone 1: Initial setup complete\\n• Milestone 2: Core functionality ready\\n• Milestone 3: Final delivery",
  "milestones": [
    {"title": "Initial setup and planning complete"},
    {"title": "Core functionality development finished"},
    {"title": "Testing and deployment complete"}
  ]
}

IMPORTANT: Adjust the roadmap structure based on the duration of ${detectedDuration}:
- For 1-7 days: Focus on daily tasks within the timeframe
- For 1 week: Break down into daily tasks for the week
- For 2+ weeks: Break down into weekly phases with daily sub-tasks
- For 1+ months: Break down into weekly phases with monthly milestones

Format the roadmap with bullet points (•) and clear breakdowns appropriate for ${detectedDuration}.
Use \\n for line breaks. Return ONLY the JSON object, no markdown formatting or code blocks.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      // Clean the response text to remove markdown formatting
      let responseText = response.text || response.response?.text();
      
      // Remove markdown code blocks if present
      responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Trim whitespace
      responseText = responseText.trim();
      
      // console.log('Raw Gemini response:', responseText); // For debugging
      
      let taskData;
      try {
        taskData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from AI');
      }
      
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Generate realistic due dates for milestones based on detected duration
      const now = new Date();
      const taskDuration = detectedDuration.toLowerCase();
      let totalDays = 14; // default 2 weeks
      
      if (taskDuration.includes('day')) {
        const days = parseInt(taskDuration) || 7;
        totalDays = days;
      } else if (taskDuration.includes('week')) {
        const weeks = parseInt(taskDuration) || 2;
        totalDays = weeks * 7;
      } else if (taskDuration.includes('month')) {
        const months = parseInt(taskDuration) || 1;
        totalDays = months * 30;
      }

      // Process milestones and add realistic due dates
      const processedMilestones = (taskData.milestones || []).map((milestone, index) => {
        const daysOffset = Math.floor((totalDays / (taskData.milestones.length + 1)) * (index + 1));
        const dueDate = new Date(now.getTime() + (daysOffset * 24 * 60 * 60 * 1000));
        
        return {
          title: milestone.title,
          completed: false,
          dueDate: dueDate
        };
      });

      const newTask = {
        title: taskData.title,
        description: taskData.description,
        roadmap: taskData.roadmap,
        priority: taskData.priority || 'medium',
        duration: detectedDuration, // Use detected duration instead of passed duration
        aiGenerated: true,
        milestones: processedMilestones,
        UserId: userId
      };

      user.tasks.push(newTask);
      await user.save();

      return {
        success: true,
        task: newTask,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Full error in generateTaskWithRoadmap:', error);
      throw new Error(`Failed to generate task: ${error.message}`);
    }
  }
}

export default GeminiService;