import React, { useState, useEffect } from "react";
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

  const handleRoadmapItemToggle = async (taskId, actualIndex, currentStatus) => {
    console.log("Toggling roadmap item:", {
      taskId,
      actualIndex,
      currentStatus,
    });

    try {
      const response = await fetch(
        `/api/ai/tasks/${taskId}/roadmap/${actualIndex}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ completed: !currentStatus }),
        }
      );

      const data = await response.json();
      if (data.success && onTaskUpdated) {
        onTaskUpdated(data.data.task);
      }
    } catch (error) {
      console.error("Error updating roadmap item:", error);
    }
  };

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

  return (
    <div className="h-full flex flex-col">
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
                {tasks.length} active tasks
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="text-indigo-400 hover:text-indigo-300 transition-colors hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 bg-black/20 backdrop-blur-sm border-x border-indigo-500/30 overflow-y-auto hide-scrollbar scrollbar-none">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <SparklesIcon className="w-16 h-16 text-purple-400/50 mb-4" />
            <p className="text-gray-400 text-lg mb-2">No tasks yet</p>
            <p className="text-gray-500 text-sm">Create your first task to get started!</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {tasks.map((task, index) => (
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
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
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
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedTask === task._id ? "rotate-180" : ""}`} />
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
                  {task.roadmapItems && task.roadmapItems.length > 0 && (
                    <div className="mb-3">
                      <div className="space-y-2">
                        {task.roadmapItems
                          .slice(0, expandedTask === task._id ? task.roadmapItems.length : 3)
                          .map((item, displayIndex) => {
                            return (
                              <div
                                key={`${task._id}-${displayIndex}`}
                                className="flex items-center gap-3 p-2 rounded hover:bg-slate-600/20 transition-colors"
                              >
                                <button
                                  onClick={() => handleRoadmapItemToggle(task._id, displayIndex, item.completed)}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                    item.completed
                                      ? "bg-purple-500 border-purple-500"
                                      : "border-gray-400 hover:border-purple-400"
                                  }`}
                                >
                                  {item.completed && (
                                    <CheckCircleIcon className="w-3 h-3 text-white" />
                                  )}
                                </button>
                                <span
                                  className={`text-sm flex-1 ${
                                    item.completed
                                      ? "text-gray-400 line-through"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </div>
                            );
                          })}

                        {/* Show more button if there are more than 3 items */}
                        {task.roadmapItems.length > 3 && expandedTask !== task._id && (
                          <button
                            onClick={() => setExpandedTask(task._id)}
                            className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                          >
                            +{task.roadmapItems.length - 3} more items...
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Expanded Content */}
                  {expandedTask === task._id && (
                    <div className="border-t border-gray-600/30 pt-3 mt-3 space-y-4">
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
            ))}
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