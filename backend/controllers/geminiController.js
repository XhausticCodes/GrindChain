import GeminiService from "../services/geminiService.js";
import User from "../models/User.js";

const geminiService = new GeminiService();

const geminiController = {
  generateTask: async (req, res) => {
    try {
      const { taskDescription, duration } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!taskDescription || taskDescription.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Task description is required (minimum 5 characters)",
        });
      }

      const result = await geminiService.generateTaskWithRoadmap(
        taskDescription,
        duration || "2 weeks",
        userId
      );

      // **NEW: Ensure the generated task has completed field set to false**
      const user = await User.findById(userId);
      if (user && user.tasks.length > 0) {
        const lastTask = user.tasks[user.tasks.length - 1];
        if (!lastTask.hasOwnProperty("completed")) {
          lastTask.completed = false;
          await user.save();
        }
      }

      res.json({
        success: true,
        message: "Task with roadmap generated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Task generation error:", error);

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
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  createManualTask: async (req, res) => {
    try {
      const { title, description, priority, duration, roadmapItems } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!title || title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Task title is required (minimum 3 characters)",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Calculate overall progress (0% for new tasks)
      const overallProgress = 0;

      const newTask = {
        title: title.trim(),
        description: description?.trim() || "",
        priority: priority || "medium",
        duration: duration || "1 week",
        roadmapItems: roadmapItems || [],
        aiGenerated: false,
        overallProgress,
        completed: false, // **NEW: Initialize completed field**
        UserId: userId,
        milestones: [], // Manual tasks can have milestones added later
      };

      user.tasks.push(newTask);
      await user.save();

      // Get the created task (last one in the array)
      const createdTask = user.tasks[user.tasks.length - 1];

      res.json({
        success: true,
        message: "Manual task created successfully",
        data: {
          task: createdTask,
        },
      });
    } catch (error) {
      console.error("Manual task creation error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create manual task",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getTasks: async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Convert tasks to regular objects and ensure roadmapItems exist
      const tasks = (user.tasks || []).map((task) => {
        const taskObj = task.toObject();

        // If roadmapItems don't exist but roadmap does, parse it
        if (!taskObj.roadmapItems && taskObj.roadmap) {
          const geminiService = new GeminiService();
          taskObj.roadmapItems = geminiService.parseRoadmapToItems(
            taskObj.roadmap
          );
        }

        return taskObj;
      });

      res.json({
        success: true,
        data: { tasks },
      });
    } catch (error) {
      console.error("Get tasks error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
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
          message: "User authentication required",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.tasks = user.tasks.filter((task) => task._id.toString() !== taskId);
      await user.save();

      res.json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Delete task error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete task",
        error: error.message,
      });
    }
  },
  updateRoadmapItem: async (req, res) => {
  try {
    const { taskId, itemIndex } = req.params;
    const { completed } = req.body;
    const userId = req.user?.id;

    console.log("UpdateRoadmapItem called with:", {
      taskId,
      itemIndex: parseInt(itemIndex),
      completed,
      userId,
    });

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // FIX: Ensure groups is an array before saving
    if (typeof user.groups === 'string') {
      user.groups = [];
    }

    const task = user.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    console.log("Task found:", {
      taskTitle: task.title,
      roadmapItemsLength: task.roadmapItems?.length || 0,
      requestedIndex: parseInt(itemIndex),
    });

    const index = parseInt(itemIndex);

    if (task.roadmapItems && task.roadmapItems[index]) {
      console.log("Updating item:", {
        currentText: task.roadmapItems[index].text,
        currentCompleted: task.roadmapItems[index].completed,
        newCompleted: completed,
      });

      task.roadmapItems[index].completed = completed;

      const completedItems = task.roadmapItems.filter(
        (item) => item.completed
      ).length;
      const totalItems = task.roadmapItems.length;
      task.overallProgress =
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      // Mark task as completed if all items are done
      task.completed = task.overallProgress === 100;

      await user.save();

      console.log("Item updated successfully:", {
        newProgress: task.overallProgress,
        completedItems,
        totalItems,
        taskCompleted: task.completed,
      });

      res.json({
        success: true,
        message: "Roadmap item updated successfully",
        data: {
          task,
          progress: task.overallProgress,
        },
      });
    } else {
      console.log("Item not found:", {
        requestedIndex: index,
        availableItems: task.roadmapItems?.length || 0,
      });

      res.status(404).json({
        success: false,
        message: "Roadmap item not found",
      });
    }
  } catch (error) {
    console.error("Update roadmap item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update roadmap item",
      error: error.message,
    });
  }
},

  getTaskAnalytics: async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const tasks = user.tasks || [];

      // Calculate analytics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.completed).length;
      const avgProgress =
        tasks.length > 0
          ? Math.round(
              tasks.reduce(
                (sum, task) => sum + (task.overallProgress || 0),
                0
              ) / tasks.length
            )
          : 0;

      const priorityBreakdown = {
        high: tasks.filter((task) => task.priority === "high").length,
        medium: tasks.filter((task) => task.priority === "medium").length,
        low: tasks.filter((task) => task.priority === "low").length,
      };

      // Get progress over time (last 7 days)
      const progressOverTime = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayTasks = tasks.filter((task) => {
          const taskDate = new Date(task.createdAt);
          return taskDate.toDateString() === date.toDateString();
        });

        progressOverTime.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          tasks: dayTasks.length,
          avgProgress:
            dayTasks.length > 0
              ? Math.round(
                  dayTasks.reduce(
                    (sum, task) => sum + (task.overallProgress || 0),
                    0
                  ) / dayTasks.length
                )
              : 0,
        });
      }

      res.json({
        success: true,
        data: {
          totalTasks,
          completedTasks,
          avgProgress,
          priorityBreakdown,
          progressOverTime,
          tasks: tasks.map((task) => ({
            id: task._id,
            title: task.title,
            progress: task.overallProgress || 0,
            priority: task.priority,
            completed: task.completed,
          })),
        },
      });
    } catch (error) {
      console.error("Get analytics error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics",
        error: error.message,
      });
    }
  },
  // Add this new method to the geminiController object

  migrateTasksCompletedField: async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let updatedCount = 0;

      // Update existing tasks that don't have the completed field
      user.tasks.forEach((task) => {
        if (!task.hasOwnProperty("completed")) {
          task.completed = task.overallProgress === 100;
          updatedCount++;
        }
      });

      if (updatedCount > 0) {
        await user.save();
      }

      res.json({
        success: true,
        message: `Updated ${updatedCount} tasks with completed field`,
        data: { updatedCount },
      });
    } catch (error) {
      console.error("Migration error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to migrate tasks",
        error: error.message,
      });
    }
  },
};

export default geminiController;
