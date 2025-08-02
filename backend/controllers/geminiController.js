import GeminiService from "../services/geminiService.js";
import User from "../models/User.js";

const geminiService = new GeminiService();

const geminiController = {
  generateTask: async (req, res) => {
    try {
      const { taskDescription, duration, isGroupMode, groupMembers } = req.body;
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
        userId,
        isGroupMode || false,
        groupMembers || []
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
      const { title, description, priority, duration, roadmapItems, isGroupTask, taskHeaders } = req.body;
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

      // Get current group ID if creating a group task
      let currentGroupId = null;
      if (isGroupTask && user.currentGroupId) {
        // user.currentGroupId is actually a joinCode, we need to get the actual ObjectId
        const Group = (await import('../models/Group.js')).default;
        const group = await Group.findOne({ joinCode: user.currentGroupId });
        if (group) {
          currentGroupId = group._id;
          console.log('Found group for manual task:', { joinCode: user.currentGroupId, objectId: currentGroupId });
        } else {
          console.warn('No group found for joinCode:', user.currentGroupId);
        }
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
        completed: false,
        UserId: userId,
        milestones: [], // Manual tasks can have milestones added later
        isGroupTask: !!isGroupTask,
        groupId: currentGroupId,
        taskHeaders: isGroupTask ? (taskHeaders || []) : undefined,
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

      const tasks = user.tasks || [];

      res.json({
        success: true,
        message: "Tasks fetched successfully",
        data: {
          tasks: tasks.map(task => ({
            ...task.toObject(),
            id: task._id,
          })),
        },
      });
    } catch (error) {
      console.error("Get tasks error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch tasks",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
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

      const taskIndex = user.tasks.findIndex(task => task._id.toString() === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      user.tasks.splice(taskIndex, 1);
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
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  updateRoadmapItem: async (req, res) => {
    try {
      const { taskId, itemIndex } = req.params;
      const { completed } = req.body;
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

      const task = user.tasks.id(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      const itemIdx = parseInt(itemIndex);
      if (itemIdx >= 0 && itemIdx < task.roadmapItems.length) {
        task.roadmapItems[itemIdx].completed = completed;

        // Recalculate overall progress
        const completedItems = task.roadmapItems.filter(item => item.completed).length;
        task.overallProgress = Math.round((completedItems / task.roadmapItems.length) * 100);
        task.completed = task.overallProgress === 100;

        await user.save();

        res.json({
          success: true,
          message: "Roadmap item updated successfully",
          data: { task }
        });
      } else {
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
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  generateGroupTaskStructure: async (req, res) => {
    try {
      const { title, description, memberCount, duration } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required",
        });
      }

      // Generate AI-powered task structure
      const result = await geminiService.generateGroupTaskStructure(
        title,
        description,
        memberCount || 2,
        duration || "1 week"
      );

      res.json({
        success: true,
        message: "Group task structure generated successfully",
        taskHeaders: result.taskHeaders || []
      });
    } catch (error) {
      console.error("Group task structure generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate group task structure",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getTaskNotifications: async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      // Get all users to find tasks assigned to current user
      const allUsers = await User.find({});
      const notifications = [];

      allUsers.forEach(userDoc => {
        if (userDoc.tasks) {
          userDoc.tasks.forEach(task => {
            // Check if task has headers assigned to current user
            if (task.isGroupTask && task.taskHeaders) {
              task.taskHeaders.forEach((header, headerIndex) => {
                if (header.assignedTo && header.assignedTo.toString() === userId) {
                  // Check if user has any incomplete subtasks
                  const incompleteSubtasks = header.subtasks ? 
                    header.subtasks.filter(subtask => !subtask.completed).length : 0;
                  
                  if (incompleteSubtasks > 0) {
                    notifications.push({
                      _id: `${task._id}-${headerIndex}`,
                      type: 'assignment',
                      title: 'New Task Assignment',
                      message: `You have been assigned to "${header.title}" with ${incompleteSubtasks} pending subtasks.`,
                      taskTitle: task.title,
                      taskId: task._id,
                      headerIndex: headerIndex,
                      actionRequired: true,
                      createdAt: task.createdAt || new Date()
                    });
                  }
                }
              });
            }
          });
        }
      });

      // Sort by creation date, newest first
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        success: true,
        notifications: notifications.slice(0, 10) // Limit to 10 notifications
      });
    } catch (error) {
      console.error("Get task notifications error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get notifications",
        error: error.message,
      });
    }
  },

  markNotificationAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      // For now, we'll just return success since notifications are dynamically generated
      // In a real app, you'd store notification read status in the database
      res.json({
        success: true,
        message: "Notification marked as read"
      });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
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

      // Get individual task progress data
      const individualTaskProgress = tasks.map((task, index) => ({
        taskId: task._id,
        taskTitle: task.title.length > 20 ? task.title.substring(0, 20) + "..." : task.title,
        progress: task.overallProgress || 0,
        priority: task.priority,
        completed: task.completed,
        // Create a simulated timeline for each task
        progressHistory: [
          { date: "Jul 27", progress: Math.max(0, (task.overallProgress || 0) - 40) },
          { date: "Jul 28", progress: Math.max(0, (task.overallProgress || 0) - 30) },
          { date: "Jul 29", progress: Math.max(0, (task.overallProgress || 0) - 20) },
          { date: "Jul 30", progress: Math.max(0, (task.overallProgress || 0) - 15) },
          { date: "Jul 31", progress: Math.max(0, (task.overallProgress || 0) - 10) },
          { date: "Aug 1", progress: Math.max(0, (task.overallProgress || 0) - 5) },
          { date: "Aug 2", progress: task.overallProgress || 0 },
        ]
      }));

      // Get progress over time (last 7 days) - now showing individual tasks
      const progressOverTime = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayData = {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };

        // Add each task's progress for this day
        tasks.forEach((task, index) => {
          const taskProgress = Math.max(0, (task.overallProgress || 0) - (6 - i) * 8);
          dayData[`task${index}`] = taskProgress;
          dayData[`taskName${index}`] = task.title.length > 15 ? task.title.substring(0, 15) + "..." : task.title;
        });

        progressOverTime.push(dayData);
      }

      console.log("📊 Analytics progressOverTime data:", JSON.stringify(progressOverTime, null, 2));
      console.log("📊 Individual tasks:", individualTaskProgress);
      console.log("📊 Total tasks:", totalTasks, "Completed:", completedTasks);

      res.json({
        success: true,
        data: {
          totalTasks,
          completedTasks,
          avgProgress,
          priorityBreakdown,
          progressOverTime: progressOverTime.length > 0 ? progressOverTime : [
            // Fallback data with multiple task progress
            { date: "Jul 27", task0: 15, task1: 25, task2: 10, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
            { date: "Jul 28", task0: 23, task1: 35, task2: 18, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
            { date: "Jul 29", task0: 31, task1: 45, task2: 26, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
            { date: "Jul 30", task0: 39, task1: 55, task2: 34, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
            { date: "Jul 31", task0: 47, task1: 65, task2: 42, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
            { date: "Aug 1", task0: 55, task1: 75, task2: 50, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
            { date: "Aug 2", task0: 63, task1: 85, task2: 58, taskName0: "Sample Task 1", taskName1: "Sample Task 2", taskName2: "Sample Task 3" },
          ],
          individualTaskProgress,
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

  updateGroupSubtask: async (req, res) => {
    try {
      const { taskId, headerIndex, subtaskIndex } = req.params;
      const { completed } = req.body;
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

      const task = user.tasks.id(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      if (!task.isGroupTask || !task.taskHeaders) {
        return res.status(400).json({
          success: false,
          message: "Not a group task",
        });
      }

      const headerIdx = parseInt(headerIndex);
      const subtaskIdx = parseInt(subtaskIndex);

      if (headerIdx >= 0 && headerIdx < task.taskHeaders.length &&
          subtaskIdx >= 0 && subtaskIdx < task.taskHeaders[headerIdx].subtasks.length) {
        
        task.taskHeaders[headerIdx].subtasks[subtaskIdx].completed = completed;

        // Calculate overall progress
        const totalSubtasks = task.taskHeaders.reduce((total, header) => 
          total + header.subtasks.length, 0
        );
        const completedSubtasks = task.taskHeaders.reduce((total, header) => 
          total + header.subtasks.filter(subtask => subtask.completed).length, 0
        );
        
        task.overallProgress = Math.round((completedSubtasks / totalSubtasks) * 100);
        task.completed = task.overallProgress === 100;

        await user.save();

        res.json({
          success: true,
          message: "Subtask updated successfully",
          data: { task }
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Subtask not found",
        });
      }
    } catch (error) {
      console.error("Update group subtask error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update subtask",
        error: error.message,
      });
    }
  },

  assignGroupTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { headerIndex, subtaskIndex, userId: assigneeId, type } = req.body;
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

      const task = user.tasks.id(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      if (!task.isGroupTask || !task.taskHeaders) {
        return res.status(400).json({
          success: false,
          message: "Not a group task",
        });
      }

      const headerIdx = parseInt(headerIndex);

      if (type === 'header' && headerIdx >= 0 && headerIdx < task.taskHeaders.length) {
        task.taskHeaders[headerIdx].assignedTo = assigneeId || null;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid assignment parameters",
        });
      }

      await user.save();

      res.json({
        success: true,
        message: "Task assigned successfully",
        data: { task }
      });
    } catch (error) {
      console.error("Assign group task error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to assign task",
        error: error.message,
      });
    }
  },

  getGroupAnalytics: async (req, res) => {
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

      // Check if user is in any group
      if (!user.currentGroupId && (!user.groups || user.groups.length === 0)) {
        return res.status(404).json({
          success: false,
          message: "User is not in any group",
          code: "NO_GROUP"
        });
      }

      // Get all users in the same group
      const groupId = user.currentGroupId || user.groups[0];
      const groupUsers = await User.find({ 
        $or: [
          { currentGroupId: groupId },
          { groups: groupId }
        ]
      });

      // Aggregate all tasks from group members
      let allTasks = [];
      let totalStreak = 0;
      let memberStats = [];

      groupUsers.forEach(member => {
        const memberTasks = member.tasks || [];
        allTasks = allTasks.concat(memberTasks);
        totalStreak += member.streak || 0;
        
        memberStats.push({
          username: member.username,
          totalTasks: memberTasks.length,
          completedTasks: memberTasks.filter(task => task.completed).length,
          avgProgress: memberTasks.length > 0 
            ? Math.round(memberTasks.reduce((sum, task) => sum + (task.overallProgress || 0), 0) / memberTasks.length)
            : 0,
          streak: member.streak || 0
        });
      });

      // Calculate group analytics
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter((task) => task.completed).length;
      const avgProgress =
        allTasks.length > 0
          ? Math.round(
              allTasks.reduce(
                (sum, task) => sum + (task.overallProgress || 0),
                0
              ) / allTasks.length
            )
          : 0;

      // Group task specific analytics
      const groupTasks = allTasks.filter(task => task.isGroupTask);
      const individualTasks = allTasks.filter(task => !task.isGroupTask);
      
      let totalGroupSubtasks = 0;
      let completedGroupSubtasks = 0;
      let groupTaskHeaders = [];

      groupTasks.forEach(task => {
        if (task.taskHeaders && Array.isArray(task.taskHeaders)) {
          task.taskHeaders.forEach(header => {
            const headerData = {
              taskTitle: task.title,
              headerTitle: header.title,
              assignedTo: header.assignedTo,
              subtasks: header.subtasks || [],
              completedSubtasks: (header.subtasks || []).filter(st => st.completed).length,
              totalSubtasks: (header.subtasks || []).length
            };
            groupTaskHeaders.push(headerData);
            
            totalGroupSubtasks += headerData.totalSubtasks;
            completedGroupSubtasks += headerData.completedSubtasks;
          });
        }
      });

      const groupTaskProgress = totalGroupSubtasks > 0 
        ? Math.round((completedGroupSubtasks / totalGroupSubtasks) * 100)
        : 0;

      const priorityBreakdown = {
        high: allTasks.filter((task) => task.priority === "high").length,
        medium: allTasks.filter((task) => task.priority === "medium").length,
        low: allTasks.filter((task) => task.priority === "low").length,
      };

      // Get group progress over time (last 7 days)
      const progressOverTime = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        
        // Count tasks that were updated on this day (checking lastModified or createdAt)
        const dayActiveTasks = allTasks.filter((task) => {
          const taskDate = task.lastModified ? new Date(task.lastModified) : new Date(task.createdAt);
          return taskDate && taskDate.toDateString() === dateString;
        });

        // If no tasks were active on this day, use a baseline from previous days
        const cumulativeCompletedTasks = allTasks.filter(task => {
          const taskCompletedDate = task.completed && task.lastModified ? 
            new Date(task.lastModified) : null;
          return taskCompletedDate && taskCompletedDate <= date;
        }).length;

        // Calculate meaningful progress for the day
        let dayProgress;
        if (dayActiveTasks.length > 0) {
          dayProgress = Math.round(
            dayActiveTasks.reduce((sum, task) => sum + (task.overallProgress || 0), 0) / dayActiveTasks.length
          );
        } else if (allTasks.length > 0) {
          // If no tasks were active today, show overall progress
          dayProgress = Math.round(allTasks.reduce((sum, task) => sum + (task.overallProgress || 0), 0) / allTasks.length);
        } else {
          // If no tasks exist, provide sample progression data
          dayProgress = Math.max(10, 15 + (i * 8)); // Creates a visible upward trend
        }

        progressOverTime.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          tasks: dayActiveTasks.length,
          completedTasks: cumulativeCompletedTasks,
          avgProgress: dayProgress,
        });
      }

      res.json({
        success: true,
        data: {
          groupId,
          totalMembers: groupUsers.length,
          totalTasks,
          completedTasks,
          avgProgress,
          totalStreak,
          avgStreak: Math.round(totalStreak / groupUsers.length),
          priorityBreakdown,
          progressOverTime,
          memberStats: memberStats.sort((a, b) => b.completedTasks - a.completedTasks), // Sort by completed tasks
          // Group task specific analytics
          groupTaskAnalytics: {
            totalGroupTasks: groupTasks.length,
            totalIndividualTasks: individualTasks.length,
            totalGroupSubtasks,
            completedGroupSubtasks,
            groupTaskProgress,
            taskHeaders: groupTaskHeaders
          },
          tasks: allTasks.map((task) => ({
            id: task._id,
            title: task.title,
            progress: task.overallProgress || 0,
            priority: task.priority,
            completed: task.completed,
            isGroupTask: task.isGroupTask || false,
          })),
        },
      });
    } catch (error) {
      console.error("Get group analytics error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch group analytics",
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
