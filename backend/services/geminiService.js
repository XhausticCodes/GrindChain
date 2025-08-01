import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import User from "../models/User.js";

class GeminiService {
  constructor() {
    this.ai = null;
    this.initialized = false;

    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required in environment variables");
    }

    this.ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    this.initialized = true;
  }

  parseRoadmapToItems(roadmapText) {
    console.log('Parsing roadmap text:', roadmapText); // Debug log
    
    const lines = roadmapText.split("\n");
    const items = [];
    let order = 0;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        // Remove bullet point and clean up the text
        const text = trimmedLine.replace(/^[•\-\*]\s*/, "").trim();
        // Less restrictive filtering - allow more items but keep them meaningful
        if (text && text.length > 5) {
          items.push({
            text: text,
            completed: false,
            order: order++,
          });
        }
      }
    });

    console.log('Parsed roadmap items:', items); // Debug log
    // Limit to maximum 10 items to keep it concise but allow more than before
    return items.slice(0, 10);
  }

  validateAndProcessResources(resources) {
    if (!resources) return { free: [], paid: [] };
    
    const processResourceArray = (resourceArray, type) => {
      if (!Array.isArray(resourceArray)) return [];
      
      return resourceArray
        .filter(resource => 
          resource && 
          resource.title && 
          resource.url && 
          resource.platform &&
          ['GeeksForGeeks', 'PW'].includes(resource.platform)
        )
        .map(resource => ({
          title: resource.title,
          url: resource.url,
          platform: resource.platform,
          type: type,
          description: resource.description || ''
        }))
        .slice(0, 3); // Limit to 3 resources per type
    };
    
    return {
      free: processResourceArray(resources.free, 'free'),
      paid: processResourceArray(resources.paid, 'paid')
    };
  }

  async generateTaskWithRoadmap(taskDescription, duration = "2 weeks", userId) {
    try {
      this.initialize();

      // Smart duration detection from task description
      let detectedDuration = duration; // Default to passed duration (2 weeks)
      const taskLower = taskDescription.toLowerCase();

      // Check for duration patterns in the user's prompt
      const durationPatterns = [
        { pattern: /(\d+)\s*day[s]?/i, multiplier: 1, unit: "day" },
        { pattern: /(\d+)\s*week[s]?/i, multiplier: 7, unit: "week" },
        { pattern: /(\d+)\s*month[s]?/i, multiplier: 30, unit: "month" },
        { pattern: /(one|1)\s*week/i, value: "1 week" },
        { pattern: /(two|2)\s*week[s]?/i, value: "2 weeks" },
        { pattern: /(three|3)\s*week[s]?/i, value: "3 weeks" },
        { pattern: /(four|4)\s*week[s]?/i, value: "4 weeks" },
        { pattern: /(one|1)\s*month/i, value: "1 month" },
        { pattern: /(two|2)\s*month[s]?/i, value: "2 months" },
        { pattern: /(three|3)\s*month[s]?/i, value: "3 months" },
      ];

      // Check each pattern
      for (const { pattern, value, multiplier, unit } of durationPatterns) {
        const match = taskLower.match(pattern);
        if (match) {
          if (value) {
            detectedDuration = value;
          } else if (multiplier && unit) {
            const number = match[1];
            if (unit === "day") {
              detectedDuration = `${number} ${number === "1" ? "day" : "days"}`;
            } else if (unit === "week") {
              detectedDuration = `${number} ${
                number === "1" ? "week" : "weeks"
              }`;
            } else if (unit === "month") {
              detectedDuration = `${number} ${
                number === "1" ? "month" : "months"
              }`;
            }
          }
          break; // Use first match found
        }
      }

      console.log(
        `Original duration: ${duration}, Detected duration: ${detectedDuration}`
      );

      const prompt = `
Create a concise task with roadmap for: "${taskDescription}"
Duration: ${detectedDuration}

IMPORTANT GUIDELINES:
1. Keep roadmap items CONCISE - merge related tasks into single actionable items
2. Maximum 8-10 roadmap items total regardless of duration
3. Each item should be substantial and meaningful, not micro-tasks
4. Include relevant learning resources from GeeksForGeeks and PW (Physics Wallah)

Provide a JSON response with:
{
  "title": "Clear, concise task title",
  "description": "Detailed description of what needs to be accomplished",
  "priority": "low/medium/high",
  "roadmap": "• Research and understand requirements\\n• Set up development environment\\n• Implement core functionality\\n• Add advanced features\\n• Test and debug\\n• Deploy and document",
  "milestones": [
    {"title": "Initial setup and planning complete"},
    {"title": "Core functionality development finished"},
    {"title": "Testing and deployment complete"}
  ],
  "resources": {
    "free": [
      {
        "title": "Relevant GeeksForGeeks Tutorial",
        "url": "https://www.geeksforgeeks.org/learn-web-development/",
        "platform": "GeeksForGeeks",
        "type": "free",
        "description": "Comprehensive tutorial covering the basics"
      },
      {
        "title": "PW Free Tutorial Series",
        "url": "https://www.pw.live/study/batches/course/web-development",
        "platform": "PW",
        "type": "free",
        "description": "Free video tutorial series"
      }
    ],
    "paid": [
      {
        "title": "Advanced PW Course",
        "url": "https://pwskills.com/course/full-stack-web-development",
        "platform": "PW",
        "type": "paid",
        "description": "Complete paid course with certification"
      }
    ]
  }
}

ROADMAP STRUCTURE RULES:
- For ${detectedDuration}: Create 6-8 substantial actionable items
- Each roadmap item should be a clear, actionable task
- Start each item with an action verb (Research, Set up, Implement, etc.)
- No sub-bullets or daily breakdowns - keep it as main phases only
- Focus on what needs to be accomplished, not when

RESOURCES REQUIREMENTS:
- Find 2-3 FREE resources (1-2 from GeeksForGeeks, 1-2 from PW)
- Find 1-2 PAID resources (from PW only - they have premium courses)
- Resources must be relevant to "${taskDescription}"
- Use realistic, working URLs
- GeeksForGeeks URLs: https://www.geeksforgeeks.org/[relevant-topic]/
- PW URLs: https://www.pw.live/study/batches/course/[course-name] or https://pwskills.com/course/[course-name]

Return ONLY the JSON object, no markdown formatting or code blocks.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      // Clean the response text to remove markdown formatting
      let responseText = response.text || response.response?.text();

      // Remove markdown code blocks if present
      responseText = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "");

      // Trim whitespace
      responseText = responseText.trim();

      // console.log('Raw Gemini response:', responseText); // For debugging

      let taskData;
      try {
        taskData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response text:", responseText);
        throw new Error("Invalid JSON response from AI");
      }

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      // Generate realistic due dates for milestones based on detected duration
      const now = new Date();
      const taskDuration = detectedDuration.toLowerCase();
      let totalDays = 14; // default 2 weeks

      if (taskDuration.includes("day")) {
        const days = parseInt(taskDuration) || 7;
        totalDays = days;
      } else if (taskDuration.includes("week")) {
        const weeks = parseInt(taskDuration) || 2;
        totalDays = weeks * 7;
      } else if (taskDuration.includes("month")) {
        const months = parseInt(taskDuration) || 1;
        totalDays = months * 30;
      }

      // Process milestones and add realistic due dates
      const processedMilestones = (taskData.milestones || []).map(
        (milestone, index) => {
          const daysOffset = Math.floor(
            (totalDays / (taskData.milestones.length + 1)) * (index + 1)
          );
          const dueDate = new Date(
            now.getTime() + daysOffset * 24 * 60 * 60 * 1000
          );

          return {
            title: milestone.title,
            completed: false,
            dueDate: dueDate,
          };
        }
      );

      const roadmapItems = this.parseRoadmapToItems(taskData.roadmap || "");
      const validatedResources = this.validateAndProcessResources(taskData.resources);
      
      console.log('Generated roadmap items:', roadmapItems);
      console.log('Generated resources:', validatedResources);

      const newTask = {
        title: taskData.title,
        description: taskData.description,
        roadmap: taskData.roadmap,
        roadmapItems: roadmapItems,
        priority: taskData.priority || "medium",
        duration: detectedDuration,
        aiGenerated: true,
        milestones: processedMilestones,
        resources: validatedResources,
        overallProgress: 0,
        UserId: userId,
      };

      user.tasks.push(newTask);
      await user.save();

      return {
        success: true,
        task: newTask,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Full error in generateTaskWithRoadmap:", error);
      throw new Error(`Failed to generate task: ${error.message}`);
    }
  }
}

export default GeminiService;
