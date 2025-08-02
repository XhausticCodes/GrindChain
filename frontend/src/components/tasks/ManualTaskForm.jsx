import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, UsersIcon, UserIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";

const ManualTaskForm = ({ onTaskCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    duration: "1 week",
    roadmapItems: [""],
    isGroupTask: false,
    taskHeaders: []
  });
  const [loading, setLoading] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [generateLoading, setGenerateLoading] = useState(false);

  // Fetch group members when component mounts
  useEffect(() => {
    fetchGroupMembers();
  }, []);

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch('/api/groups/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success && data.group && data.group.members) {
        setGroupMembers(data.group.members);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Reset task headers when switching to individual task
    if (name === 'isGroupTask' && !checked) {
      setFormData((prev) => ({
        ...prev,
        taskHeaders: []
      }));
    }

    // Add default task header when switching to group task
    if (name === 'isGroupTask' && checked && formData.taskHeaders.length === 0) {
      setFormData((prev) => ({
        ...prev,
        taskHeaders: [{
          title: "",
          assignedTo: "",
          subtasks: [{ text: "" }]
        }]
      }));
    }
  };

  const handleRoadmapItemChange = (index, value) => {
    const newItems = [...formData.roadmapItems];
    newItems[index] = value;
    setFormData((prev) => ({
      ...prev,
      roadmapItems: newItems,
    }));
  };

  const addRoadmapItem = () => {
    setFormData((prev) => ({
      ...prev,
      roadmapItems: [...prev.roadmapItems, ""],
    }));
  };

  const removeRoadmapItem = (index) => {
    if (formData.roadmapItems.length > 1) {
      const newItems = formData.roadmapItems.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        roadmapItems: newItems,
      }));
    }
  };

  // Task Header Functions
  const addTaskHeader = () => {
    setFormData((prev) => ({
      ...prev,
      taskHeaders: [...prev.taskHeaders, {
        title: "",
        assignedTo: "",
        subtasks: [{ text: "" }]
      }]
    }));
  };

  const removeTaskHeader = (headerIndex) => {
    if (formData.taskHeaders.length > 1) {
      const newHeaders = formData.taskHeaders.filter((_, i) => i !== headerIndex);
      setFormData((prev) => ({
        ...prev,
        taskHeaders: newHeaders,
      }));
    }
  };

  const handleTaskHeaderChange = (headerIndex, field, value) => {
    const newHeaders = [...formData.taskHeaders];
    newHeaders[headerIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      taskHeaders: newHeaders,
    }));
  };

  const addSubtask = (headerIndex) => {
    const newHeaders = [...formData.taskHeaders];
    newHeaders[headerIndex].subtasks.push({ text: "" });
    setFormData((prev) => ({
      ...prev,
      taskHeaders: newHeaders,
    }));
  };

  const removeSubtask = (headerIndex, subtaskIndex) => {
    if (formData.taskHeaders[headerIndex].subtasks.length > 1) {
      const newHeaders = [...formData.taskHeaders];
      newHeaders[headerIndex].subtasks = newHeaders[headerIndex].subtasks.filter((_, i) => i !== subtaskIndex);
      setFormData((prev) => ({
        ...prev,
        taskHeaders: newHeaders,
      }));
    }
  };

  const handleSubtaskChange = (headerIndex, subtaskIndex, value) => {
    const newHeaders = [...formData.taskHeaders];
    newHeaders[headerIndex].subtasks[subtaskIndex].text = value;
    setFormData((prev) => ({
      ...prev,
      taskHeaders: newHeaders,
    }));
  };

  // Generate Group Task Suggestions
  const generateGroupTaskSuggestions = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in title and description first');
      return;
    }

    setGenerateLoading(true);
    try {
      const response = await fetch('/api/ai/generate-group-task-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          memberCount: groupMembers.length,
          duration: formData.duration
        })
      });

      const data = await response.json();
      
      if (data.success && data.taskHeaders) {
        // Smart assignment: distribute tasks based on member workload
        const membersWithWorkload = await getMemberWorkloads();
        const headersWithSmartAssignments = data.taskHeaders.map((header, index) => {
          // Find member with least workload for this task
          const assignedMember = getOptimalMemberForTask(membersWithWorkload, header);
          return {
            ...header,
            assignedTo: assignedMember ? assignedMember._id : ''
          };
        });
        
        setFormData(prev => ({
          ...prev,
          taskHeaders: headersWithSmartAssignments,
          isGroupTask: true
        }));
      } else {
        console.error('Failed to generate group task structure:', data.message);
        alert('Failed to generate task suggestions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating group task structure:', error);
      alert('Error generating task suggestions. Please try again.');
    } finally {
      setGenerateLoading(false);
    }
  };

  // Helper function to get member workloads
  const getMemberWorkloads = async () => {
    try {
      const response = await fetch('/api/ai/group-member-workloads', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        return data.memberWorkloads || groupMembers.map(member => ({
          ...member,
          currentTasks: 0,
          completionRate: 1.0
        }));
      }
    } catch (error) {
      console.error('Error fetching member workloads:', error);
    }
    
    // Fallback: return members with default workload
    return groupMembers.map(member => ({
      ...member,
      currentTasks: 0,
      completionRate: 1.0
    }));
  };

  // Helper function to find optimal member for a task
  const getOptimalMemberForTask = (membersWithWorkload, taskHeader) => {
    if (membersWithWorkload.length === 0) return null;
    
    // Sort members by current workload (ascending) and completion rate (descending)
    const sortedMembers = [...membersWithWorkload].sort((a, b) => {
      const workloadDiff = a.currentTasks - b.currentTasks;
      if (workloadDiff !== 0) return workloadDiff;
      return b.completionRate - a.completionRate;
    });
    
    return sortedMembers[0];
  };

  // Assignment Functions
  const openAssignDialog = (task) => {
    setCurrentTask(task);
    if (task && task.taskHeaders) {
      const currentAssignments = {};
      task.taskHeaders.forEach((header, index) => {
        currentAssignments[index] = header.assignedTo || '';
      });
      setAssignments(currentAssignments);
    }
    setShowAssignDialog(true);
  };

  const closeAssignDialog = () => {
    setShowAssignDialog(false);
    setCurrentTask(null);
    setAssignments({});
  };

  const handleAssignmentChange = (headerIndex, userId) => {
    setAssignments(prev => ({
      ...prev,
      [headerIndex]: userId
    }));
  };

  const saveAssignments = async () => {
    if (!currentTask) return;
    
    // If this is a preview (before task creation), just close the dialog
    if (currentTask._id === 'preview') {
      // Update the form data with assignments
      const newHeaders = [...formData.taskHeaders];
      Object.entries(assignments).forEach(([headerIndex, userId]) => {
        if (newHeaders[parseInt(headerIndex)]) {
          newHeaders[parseInt(headerIndex)].assignedTo = userId;
        }
      });
      setFormData(prev => ({
        ...prev,
        taskHeaders: newHeaders
      }));
      closeAssignDialog();
      return;
    }
    
    setLoading(true);
    
    try {
      // Update assignments for each header
      for (const [headerIndex, userId] of Object.entries(assignments)) {
        if (currentTask.taskHeaders[parseInt(headerIndex)].assignedTo !== userId) {
          const response = await fetch(`/api/ai/tasks/${currentTask._id}/assign`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ 
              headerIndex: parseInt(headerIndex), 
              userId: userId || null, 
              type: 'header' 
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update assignment');
          }
        }
      }

      closeAssignDialog();
      // Optionally trigger a refresh of tasks
      if (onTaskCreated) {
        // This would refresh the task list
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error('Error saving assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        duration: formData.duration,
        roadmapItems: formData.roadmapItems
          .filter((item) => item.trim())
          .map((item, index) => ({
            text: item.trim(),
            completed: false,
            order: index,
          })),
        aiGenerated: false,
        isGroupTask: formData.isGroupTask,
      };

      // Add task headers for group tasks
      if (formData.isGroupTask && formData.taskHeaders.length > 0) {
        taskData.taskHeaders = formData.taskHeaders
          .filter(header => header.title.trim())
          .map(header => ({
            title: header.title.trim(),
            assignedTo: header.assignedTo || null,
            subtasks: header.subtasks
              .filter(subtask => subtask.text.trim())
              .map(subtask => ({
                text: subtask.text.trim(),
                completed: false
              }))
          }));
      }

      const response = await fetch("/api/ai/create-manual-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        onTaskCreated(data.data.task);

        // If it's a group task with assignments, open assignment dialog
        if (formData.isGroupTask && formData.taskHeaders.some(h => h.title.trim())) {
          openAssignDialog(data.data.task);
        }

        // Reset form
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          duration: "1 week",
          roadmapItems: [""],
          isGroupTask: false,
          taskHeaders: []
        });
      } else {
        console.error("Failed to create task:", data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-400/10 shadow-[0_0_40px_10px_rgba(59,130,246,0.15)] rounded-2xl h-full flex flex-col justify-center">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-t-2xl p-4">
        <div className="flex items-center gap-3">
          <PlusIcon className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Create Manual Task
            </h2>
            <p className="text-sm text-gray-400">
              Design your own productivity journey
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-black/20 backdrop-blur-sm border-x border-blue-500/30 p-6 overflow-y-auto scrollbar-none hide-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Enter your task title..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              placeholder="Describe what you want to accomplish..."
            />
          </div>

          {/* Priority and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="1 day">1 Day</option>
                <option value="3 days">3 Days</option>
                <option value="1 week">1 Week</option>
                <option value="2 weeks">2 Weeks</option>
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
              </select>
            </div>
          </div>

          {/* Group Task Toggle */}
          {groupMembers.length > 0 && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center gap-3 ">
                <input
                  type="checkbox"
                  id="isGroupTask"
                  name="isGroupTask"
                  checked={formData.isGroupTask}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isGroupTask" className="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer">
                  <UsersIcon className="w-4 h-4" />
                  Create as Group Task
                </label>
              </div>
              
              {/* Content area that maintains consistent height */}
              <div className="min-h-[40px] flex items-center">
                {formData.isGroupTask ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-400">
                        Group tasks can be divided into sections and assigned to different team members
                      </p>
                      {formData.title.trim() && formData.description.trim() && (
                        <button
                          type="button"
                          onClick={generateGroupTaskSuggestions}
                          disabled={generateLoading}
                          className="mt-2 text-xs text-green-400 hover:text-green-300 flex items-center gap-1 self-start"
                        >
                          {generateLoading ? (
                            <>
                              <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Generate Sections
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    {formData.taskHeaders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          // Create a mock task for assignment preview
                          const mockTask = {
                            _id: 'preview',
                            title: formData.title || 'New Group Task',
                            taskHeaders: formData.taskHeaders.filter(h => h.title.trim())
                          };
                          openAssignDialog(mockTask);
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 whitespace-nowrap ml-3"
                      >
                        <UsersIcon className="w-3 h-3" />
                        Preview Assignments
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full ">
                    <p className="text-xs text-gray-500 text-center">
                      Enable group tasks to collaborate with your team members on complex projects
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Task Headers for Group Tasks */}
          {formData.isGroupTask && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300">
                  Task Sections (Headers)
                </label>
                <div className="flex gap-2">
                  {formData.taskHeaders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        // Auto-assign all sections in round-robin
                        const newHeaders = [...formData.taskHeaders];
                        newHeaders.forEach((header, index) => {
                          if (groupMembers.length > 0) {
                            header.assignedTo = groupMembers[index % groupMembers.length]._id;
                          }
                        });
                        setFormData(prev => ({
                          ...prev,
                          taskHeaders: newHeaders
                        }));
                      }}
                      className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1"
                    >
                      <UsersIcon className="w-3 h-3" />
                      Auto-assign All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addTaskHeader}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Section
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {formData.taskHeaders.map((header, headerIndex) => (
                  <div key={headerIndex} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={header.title}
                        onChange={(e) => handleTaskHeaderChange(headerIndex, 'title', e.target.value)}
                        placeholder={`Section ${headerIndex + 1} title...`}
                        className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      />
                      <select
                        value={header.assignedTo}
                        onChange={(e) => handleTaskHeaderChange(headerIndex, 'assignedTo', e.target.value)}
                        className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                      >
                        <option value="">Assign to...</option>
                        {groupMembers.map(member => (
                          <option key={member._id} value={member._id}>
                            {member.username}
                          </option>
                        ))}
                      </select>
                      {header.assignedTo && (
                        <div className="flex items-center gap-1 text-green-400 text-xs">
                          <CheckIcon className="w-3 h-3" />
                          <span>Assigned</span>
                        </div>
                      )}
                      {formData.taskHeaders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTaskHeader(headerIndex)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Subtasks */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Subtasks</span>
                        <button
                          type="button"
                          onClick={() => addSubtask(headerIndex)}
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                        >
                          <PlusIcon className="w-3 h-3" />
                          Add Subtask
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {header.subtasks.map((subtask, subtaskIndex) => (
                          <div key={subtaskIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={subtask.text}
                              onChange={(e) => handleSubtaskChange(headerIndex, subtaskIndex, e.target.value)}
                              placeholder={`Subtask ${subtaskIndex + 1}...`}
                              className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-1.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400"
                            />
                            {header.subtasks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubtask(headerIndex, subtaskIndex)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {formData.taskHeaders.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm border border-dashed border-slate-600 rounded-lg">
                    <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Add sections to organize your group task</p>
                    <button
                      type="button"
                      onClick={addTaskHeader}
                      className="mt-2 text-blue-400 hover:text-blue-300"
                    >
                      Add First Section
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Roadmap Items - Only show for individual tasks */}
          {!formData.isGroupTask && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Steps / Roadmap
              </label>
              <div className="space-y-2">
                {formData.roadmapItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleRoadmapItemChange(index, e.target.value)
                      }
                      className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder={`Step ${index + 1}...`}
                    />
                    {formData.roadmapItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoadmapItem(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addRoadmapItem}
                  className="w-full border-2 border-dashed border-blue-500/50 rounded-lg py-2 text-blue-400 hover:border-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add Another Step
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {loading ? "Creating Task..." : 
             formData.isGroupTask ? "Create Group Task & Assign" : "Create Individual Task"}
          </button>
          
          {formData.isGroupTask && formData.taskHeaders.length > 0 && (
            <p className="text-xs text-gray-400 text-center -mt-2">
              You can assign sections to team members after creating the task
            </p>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-b-2xl p-4">
        <div className="text-center text-sm text-gray-400">
          ✨ Craft your perfect productivity plan ✨
        </div>
      </div>

      {/* Assignment Dialog */}
      {showAssignDialog && currentTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-400/30 w-full max-w-lg mx-4 overflow-hidden">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-purple-400/20 to-blue-400/20 px-6 py-4 border-b border-purple-400/30">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Assign Task Sections
                </h2>
                <button
                  onClick={closeAssignDialog}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentTask.title}
              </p>
            </div>

            {/* Dialog Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {currentTask.taskHeaders && currentTask.taskHeaders.length > 0 ? (
                <div className="space-y-4">
                  {currentTask.taskHeaders.map((header, headerIndex) => (
                    <div key={headerIndex} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {headerIndex + 1}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white flex-1">
                          {header.title}
                        </h3>
                      </div>
                      
                      <div className="ml-11">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Assign to team member:
                        </label>
                        <select
                          value={assignments[headerIndex] || ''}
                          onChange={(e) => handleAssignmentChange(headerIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select team member...</option>
                          {groupMembers.map(member => (
                            <option key={member._id} value={member._id}>
                              {member.username}
                            </option>
                          ))}
                        </select>
                        
                        {header.subtasks && header.subtasks.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Subtasks ({header.subtasks.length}):
                            </p>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                              {header.subtasks.slice(0, 3).map((subtask, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                  {subtask.text || `Subtask ${idx + 1}`}
                                </li>
                              ))}
                              {header.subtasks.length > 3 && (
                                <li className="text-gray-400 text-xs">
                                  +{header.subtasks.length - 3} more subtasks
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    This task doesn't have any sections to assign
                  </p>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex gap-3">
              <button
                onClick={closeAssignDialog}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={saveAssignments}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    Save Assignments
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualTaskForm;
