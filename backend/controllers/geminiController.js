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

      // Get all users to find tasks assigned to current user
      const allUsers = await User.find({});
      const allTasks = [];

      // Collect tasks from all users
      allUsers.forEach(userDoc => {
        if (userDoc.tasks) {
          userDoc.tasks.forEach(task => {
            const taskObj = task.toObject();
            
            // Check if current user should see this task
            const isCreator = taskObj.UserId && taskObj.UserId.toString() === userId;
            const isDirectlyAssigned = taskObj.assignedTo && taskObj.assignedTo.toString() === userId;
            
            // Check if assigned to any header (no longer checking subtasks)
            let isAssignedToHeader = false;
            if (taskObj.taskHeaders) {
              taskObj.taskHeaders.forEach(header => {
                // Check if assigned to header
                if (header.assignedTo && header.assignedTo.toString() === userId) {
                  isAssignedToHeader = true;
                }
              });
            }

            // Include task if user is creator, assigned, or assigned to headers
            if (isCreator || isDirectlyAssigned || isAssignedToHeader) {
              // If roadmapItems don't exist but roadmap does, parse it
              if (!taskObj.roadmapItems && taskObj.roadmap) {
                const geminiService = new GeminiService();
                taskObj.roadmapItems = geminiService.parseRoadmapToItems(
                  taskObj.roadmap
                );
              }

              // Add creator info for better UX
              taskObj.createdBy = {
                id: userDoc._id,
                username: userDoc.username
              };

              allTasks.push(taskObj);
            }
          });
        }
      });

      // Remove duplicates based on task ID
      const uniqueTasks = allTasks.filter((task, index, self) => 
        index === self.findIndex(t => t._id.toString() === task._id.toString())
      );

      res.json({
        success: true,
        data: { tasks: uniqueTasks },
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

    // // FIX: Ensure groups is an array before saving
    // if (typeof user.groups === 'string') {
    //   user.groups = [];
    // }

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
        const dayTasks = allTasks.filter((task) => {
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
