import React, { useState, useEffect, useCallback } from "react";
import {
  TrashIcon,
  ChevronDownIcon,
  SparklesIcon,
  ClockIcon,
  FlagIcon,
  MapIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const TaskList = ({
  tasks,
  loading,
  onTaskDeleted,
  onRefresh,
  onTaskUpdated,
}) => {
  const [expandedTask, setExpandedTask] = useState(null);
  const [optimisticTasks, setOptimisticTasks] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState(new Set());

  // Sync optimistic tasks with actual tasks
  useEffect(() => {
    setOptimisticTasks(tasks);
  }, [tasks]);

  const handleRoadmapItemToggle = useCallback(async (taskId, itemIndex, currentStatus) => {
    const newStatus = !currentStatus;
    const updateKey = `${taskId}-${itemIndex}`;
    
    // Prevent duplicate updates
    if (pendingUpdates.has(updateKey)) {
      return;
    }

    // Add to pending updates
    setPendingUpdates(prev => new Set(prev).add(updateKey));
    
    console.log("Checkbox toggle:", {
      taskId,
      itemIndex,
      currentStatus,
      newStatus,
      isAIGenerated: optimisticTasks.find(t => t._id === taskId)?.aiGenerated
    });

    // 1. IMMEDIATE optimistic update (instant visual feedback)
    setOptimisticTasks(prevTasks => 
      prevTasks.map(task => {
        if (task._id === taskId) {
          // Ensure roadmapItems exists and is an array
          if (!task.roadmapItems || !Array.isArray(task.roadmapItems)) {
            console.warn("Invalid roadmapItems structure for task:", task.title);
            return task;
          }

          // Check if itemIndex is valid
          if (itemIndex < 0 || itemIndex >= task.roadmapItems.length) {
            console.warn("Invalid itemIndex:", itemIndex, "for task:", task.title);
            return task;
          }

          const updatedRoadmapItems = [...task.roadmapItems];
          updatedRoadmapItems[itemIndex] = {
            ...updatedRoadmapItems[itemIndex],
            completed: newStatus
          };

          // Calculate new progress
          const completedItems = updatedRoadmapItems.filter(item => item.completed).length;
          const totalItems = updatedRoadmapItems.length;
          const newProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

          return {
            ...task,
            roadmapItems: updatedRoadmapItems,
            overallProgress: newProgress,
            completed: newProgress === 100
          };
        }
        return task;
      })
    );

    // 2. Backend update (happens in background)
    try {
      const response = await fetch(
        `/api/ai/tasks/${taskId}/roadmap/${itemIndex}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ completed: newStatus }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        console.log("Backend update successful for:", updateKey);
        // Update parent state with server response
        if (onTaskUpdated) {
          onTaskUpdated(data.data.task);
        }
      } else {
        console.error('Failed to update task:', data.message);
        // Revert optimistic update on error
        setOptimisticTasks(tasks);
      }
    } catch (error) {
      console.error("Error updating roadmap item:", error);
      // Revert optimistic update on error
      setOptimisticTasks(tasks);
    } finally {
      // Remove from pending updates
      setPendingUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateKey);
        return newSet;
      });
    }
  }, [onTaskUpdated, tasks, pendingUpdates]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/ai/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        onTaskDeleted(taskId);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-orange-500";
      case "medium":
        return "from-yellow-500 to-amber-500";
      case "low":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  // Use optimistic tasks for rendering
  const tasksToRender = optimisticTasks;

  return (
    <div className="bg-indigo-400/10 shadow-[0_0_40px_10px_rgba(99,102,241,0.15)] rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-t-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Task Management
              </h2>
              <p className="text-sm text-gray-400">
                {tasksToRender.length} active tasks
                {pendingUpdates.size > 0 && (
                  <span className="ml-2 text-yellow-400">
                    ({pendingUpdates.size} updating...)
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="text-indigo-400 hover:text-indigo-300 transition-colors hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 bg-black/20 backdrop-blur-sm border-x border-indigo-500/30 overflow-y-auto scrollbar-none hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tasksToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <SparklesIcon className="w-16 h-16 text-purple-400/50 mb-4" />
            <p className="text-gray-400 text-lg mb-2">No tasks yet</p>
            <p className="text-gray-500 text-sm">
              Create your first task to get started!
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {tasksToRender.map((task, index) => {
              // Validate task structure
              if (!task || !task._id) {
                console.warn("Invalid task structure:", task);
                return null;
              }

              return (
                <div key={task._id} className="group">
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300">
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white text-lg">
                            {task.title}
                          </h3>
                          {task.aiGenerated ? (
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                              AI
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                              Manual
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <div className="flex items-center gap-1">
                            <FlagIcon className="w-4 h-4" />
                            <span className={`bg-gradient-to-r ${getPriorityColor(task.priority)} bg-clip-text text-transparent font-medium`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{task.duration}</span>
                          </div>
                          {task.roadmapItems?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MapIcon className="w-4 h-4" />
                              <span>{task.roadmapItems.length} items</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {task.roadmapItems && task.roadmapItems.length > 0 && (
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400">Progress</span>
                              <span className="text-xs text-gray-400">
                                {task.overallProgress || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${task.overallProgress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                          className="text-gray-400 hover:text-purple-400 transition-colors hover:scale-105"
                        >
                          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${expandedTask === task._id ? "rotate-180" : ""}`} />
                        </button>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-gray-400 hover:text-red-400 transition-colors hover:scale-105"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Roadmap Items Section */}
                    {task.roadmapItems && Array.isArray(task.roadmapItems) && task.roadmapItems.length > 0 && (
                      <div className="mb-3">
                        <div className="space-y-2">
                          {task.roadmapItems
                            .slice(0, expandedTask === task._id ? task.roadmapItems.length : 3)
                            .map((item, displayIndex) => {
                              const updateKey = `${task._id}-${displayIndex}`;
                              const isPending = pendingUpdates.has(updateKey);

                              // Validate item structure
                              if (!item || typeof item.text !== 'string') {
                                console.warn("Invalid roadmap item:", item, "for task:", task.title);
                                return null;
                              }

                              return (
                                <div
                                  key={`${task._id}-${displayIndex}`}
                                  className="flex items-center gap-3 p-2 rounded hover:bg-slate-600/20 transition-colors duration-200"
                                >
                                  <button
                                    onClick={() => handleRoadmapItemToggle(task._id, displayIndex, item.completed)}
                                    disabled={isPending}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                      item.completed
                                        ? "bg-purple-500 border-purple-500 scale-110"
                                        : "border-gray-400 hover:border-purple-400 hover:scale-105"
                                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {item.completed && (
                                      <CheckCircleIcon className="w-3 h-3 text-white" />
                                    )}
                                  </button>
                                  <span
                                    className={`text-sm flex-1 transition-all duration-300 ${
                                      item.completed
                                        ? "text-gray-400 line-through"
                                        : "text-gray-300"
                                    } ${isPending ? 'opacity-70' : ''}`}
                                  >
                                    {item.text}
                                    {isPending && (
                                      <span className="ml-2 text-yellow-400 text-xs">
                                        ⏳
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}

                          {/* Show more button if there are more than 3 items */}
                          {task.roadmapItems.length > 3 && expandedTask !== task._id && (
                            <button
                              onClick={() => setExpandedTask(task._id)}
                              className="text-purple-400 text-sm hover:text-purple-300 transition-colors duration-200"
                            >
                              +{task.roadmapItems.length - 3} more items...
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Expanded Content */}
                    {expandedTask === task._id && (
                      <div className="border-t border-gray-600/30 pt-3 mt-3 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {task.description && (
                          <div>
                            <h4 className="text-purple-400 font-medium mb-2">Description</h4>
                            <p className="text-gray-300 text-sm">{task.description}</p>
                          </div>
                        )}

                        {/* Milestones */}
                        {task.milestones && task.milestones.length > 0 && (
                          <div>
                            <h4 className="text-purple-400 font-medium mb-2">Milestones</h4>
                            <div className="space-y-2">
                              {task.milestones.map((milestone, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20 flex items-center gap-3"
                                >
                                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                  <div className="flex-1">
                                    <p className="text-white font-medium text-sm">{milestone.title}</p>
                                    {milestone.dueDate && (
                                      <p className="text-gray-400 text-xs mt-1">
                                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-b-2xl p-4">
        <div className="text-center text-sm text-gray-400">
          ✨ Organize your productivity journey ✨
        </div>
      </div>
    </div>
  );
};

export default TaskList;