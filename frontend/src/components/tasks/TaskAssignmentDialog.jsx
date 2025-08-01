import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  UsersIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

const TaskAssignmentDialog = ({ isOpen, onClose, task, groupMembers, onAssignmentUpdated }) => {
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && task.taskHeaders) {
      const currentAssignments = {};
      task.taskHeaders.forEach((header, index) => {
        currentAssignments[index] = header.assignedTo || '';
      });
      setAssignments(currentAssignments);
    }
  }, [task]);

  const handleAssignmentChange = (headerIndex, userId) => {
    setAssignments(prev => ({
      ...prev,
      [headerIndex]: userId
    }));
  };

  const handleSaveAssignments = async () => {
    setLoading(true);
    
    try {
      // Update assignments for each header
      for (const [headerIndex, userId] of Object.entries(assignments)) {
        if (task.taskHeaders[parseInt(headerIndex)].assignedTo !== userId) {
          const response = await fetch(`/api/ai/tasks/${task._id}/assign`, {
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

      // Fetch updated task
      const taskResponse = await fetch(`/api/ai/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (taskResponse.ok) {
        const data = await taskResponse.json();
        const updatedTask = data.data.tasks.find(t => t._id === task._id);
        if (updatedTask && onAssignmentUpdated) {
          onAssignmentUpdated(updatedTask);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-400/30 w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-400/20 to-blue-400/20 px-6 py-4 border-b border-purple-400/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Assign Task Sections
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {task.title}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {task.taskHeaders && task.taskHeaders.length > 0 ? (
            <div className="space-y-4">
              {task.taskHeaders.map((header, headerIndex) => (
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

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAssignments}
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
  );
};

export default TaskAssignmentDialog;
