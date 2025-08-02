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

  parseRoadmapToItems(roadmapData) {
    console.log('Parsing roadmap data:', roadmapData); // Debug log
    
    const items = [];
    let order = 0;

    // Handle both array and string formats
    let lines = [];
    if (Array.isArray(roadmapData)) {
      lines = roadmapData;
    } else if (typeof roadmapData === 'string') {
      lines = roadmapData.split("\n");
    } else {
      console.warn('Invalid roadmap data format:', typeof roadmapData);
      return items;
    }

    lines.forEach((line) => {
      const trimmedLine = typeof line === 'string' ? line.trim() : String(line).trim();
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
    
    // Define fallback URLs for PW platform
    const pwFallbackUrls = {
      free: [
        { 
          url: "https://www.youtube.com/@PhysicsWallah", 
          title: "Physics Wallah YouTube Channel",
          description: "Free educational content and tutorials"
        },
        {
          url: "https://www.pw.live",
          title: "Physics Wallah Official Website", 
          description: "Free resources and course information"
        }
      ],
      paid: [
        {
          url: "https://pwskills.com",
          title: "PW Skills Premium Courses",
          description: "Professional courses with certification"
        }
      ]
    };
    
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
        .map(resource => {
          // Validate and fix PW URLs
          if (resource.platform === 'PW') {
            // Check if URL looks suspicious or likely to be broken
            const suspiciousPatterns = [
              /\/batches\/course\//,  // Old URL pattern that doesn't work
              /course\/[a-zA-Z-]+$/,  // Generic course paths that might be broken
            ];
            
            const isSuspicious = suspiciousPatterns.some(pattern => 
              pattern.test(resource.url)
            ) || !resource.url.startsWith('https://');
            
            // If URL looks suspicious, use fallback
            if (isSuspicious) {
              const fallback = pwFallbackUrls[type]?.[0];
              if (fallback) {
                console.log(`Replacing suspicious PW URL: ${resource.url} with ${fallback.url}`);
                return {
                  title: resource.title,
                  url: fallback.url,
                  platform: resource.platform,
                  type: type,
                  description: `${resource.description || ''} (Updated working link)`.trim()
                };
              }
            }
          }
          
          return {
            title: resource.title,
            url: resource.url,
            platform: resource.platform,
            type: type,
            description: resource.description || ''
          };
        })
        .slice(0, 3); // Limit to 3 resources per type
    };
    
    return {
      free: processResourceArray(resources.free, 'free'),
      paid: processResourceArray(resources.paid, 'paid')
    };
  }

  async generateTaskWithRoadmap(taskDescription, duration = "2 weeks", userId, isGroupMode = false, groupMembers = []) {
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

      // Build the prompt based on whether it's group mode or individual mode
      let prompt = `
Create a concise task with roadmap for: "${taskDescription}"
Duration: ${detectedDuration}
${isGroupMode ? `Mode: Group Task (${groupMembers.length} members available for assignment)` : 'Mode: Individual Task'}

IMPORTANT GUIDELINES:
1. Keep roadmap items CONCISE - merge related tasks into single actionable items
2. Maximum 8-10 roadmap items total regardless of duration
3. Each item should be substantial and meaningful, not micro-tasks
4. Include relevant learning resources from GeeksForGeeks and PW (Physics Wallah)
${isGroupMode ? '5. Create task headers with subtasks that can be distributed among team members' : ''}

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
  ],`;

      if (isGroupMode) {
        prompt += `
  "taskHeaders": [
    {
      "title": "Research & Planning",
      "subtasks": [
        {"text": "Market research and requirement analysis"},
        {"text": "Create project timeline and milestones"},
        {"text": "Define technical architecture"}
      ]
    },
    {
      "title": "Development Phase",
      "subtasks": [
        {"text": "Set up development environment"},
        {"text": "Implement core features"},
        {"text": "Add user interface components"}
      ]
    },
    {
      "title": "Testing & Deployment",
      "subtasks": [
        {"text": "Unit testing and integration testing"},
        {"text": "User acceptance testing"},
        {"text": "Deploy to production environment"}
      ]
    }
  ],`;
      }

      prompt += `
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
        "title": "PW Free Programming Course",
        "url": "https://www.youtube.com/@PhysicsWallah",
        "platform": "PW",
        "type": "free",
        "description": "Free video tutorial series on YouTube"
      }
    ],
    "paid": [
      {
        "title": "PW Skills Web Development Course",
        "url": "https://pwskills.com/course/full-stack-web-development-course",
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
${isGroupMode ? '- Create 3-4 task headers with 3-4 subtasks each for team distribution' : ''}

RESOURCES REQUIREMENTS:
- Find 2-3 FREE resources (1-2 from GeeksForGeeks, 1-2 from PW)
- Find 1-2 PAID resources (from PW only - they have premium courses)
- Resources must be relevant to "${taskDescription}"
- Use these verified URL patterns:
- GeeksForGeeks URLs: https://www.geeksforgeeks.org/[relevant-topic]/
- PW FREE URLs: Use https://www.pw.live or YouTube PW channels like https://www.youtube.com/@PhysicsWallah
- PW PAID URLs: Use https://pwskills.com or https://www.pw.live (verified working domains)
- For programming topics, use: https://pwskills.com/course/data-structures-and-algorithms-java
- For web development: https://pwskills.com/course/full-stack-web-development-course
- For data science: https://pwskills.com/course/data-science-course
- Always use realistic course names that PW actually offers

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

      // Get user's current group if in group mode
      let currentGroupId = null;
      if (isGroupMode && user.currentGroupId) {
        // user.currentGroupId is actually a joinCode, we need to get the actual ObjectId
        const Group = (await import('../models/Group.js')).default;
        const group = await Group.findOne({ joinCode: user.currentGroupId });
        if (group) {
          currentGroupId = group._id;
          console.log('Found group for task:', { joinCode: user.currentGroupId, objectId: currentGroupId });
        } else {
          console.warn('No group found for joinCode:', user.currentGroupId);
        }
      }

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
        isGroupTask: isGroupMode,
        groupId: currentGroupId,
        taskHeaders: isGroupMode ? (taskData.taskHeaders || []) : undefined,
      };

      console.log('Creating new task with:', {
        title: newTask.title,
        isGroupTask: newTask.isGroupTask,
        groupId: newTask.groupId,
        hasTaskHeaders: !!newTask.taskHeaders
      });

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
