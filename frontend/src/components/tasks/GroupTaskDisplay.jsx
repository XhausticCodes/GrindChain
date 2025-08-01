import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  UserIcon, 
  CheckCircleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon 
} from '@heroicons/react/24/outline';

const GroupTaskDisplay = ({ task, groupMembers, onTaskUpdated, onAssignmentChanged }) => {
  const [expandedHeaders, setExpandedHeaders] = useState({});
  const [members, setMembers] = useState(groupMembers || []);

  useEffect(() => {
    setMembers(groupMembers || []);
  }, [groupMembers]);

  const toggleHeader = (headerIndex) => {
    setExpandedHeaders(prev => ({
      ...prev,
      [headerIndex]: !prev[headerIndex]
    }));
  };

  const handleSubtaskToggle = async (headerIndex, subtaskIndex, completed) => {
    try {
      // Optimistic update
      const updatedTask = { ...task };
      updatedTask.taskHeaders[headerIndex].subtasks[subtaskIndex].completed = completed;
      
      // Calculate progress
      const totalSubtasks = updatedTask.taskHeaders.reduce((total, header) => 
        total + header.subtasks.length, 0
      );
      const completedSubtasks = updatedTask.taskHeaders.reduce((total, header) => 
        total + header.subtasks.filter(subtask => subtask.completed).length, 0
      );
      
      updatedTask.overallProgress = Math.round((completedSubtasks / totalSubtasks) * 100);
      updatedTask.completed = updatedTask.overallProgress === 100;

      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }

      // API call to update backend
      const response = await fetch(`/api/ai/tasks/${task._id}/group-subtask/${headerIndex}/${subtaskIndex}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ completed })
      });

      if (!response.ok) {
        throw new Error('Failed to update subtask');
      }

    } catch (error) {
      console.error('Error updating subtask:', error);
      // Revert optimistic update on error
      if (onTaskUpdated) {
        onTaskUpdated(task);
      }
    }
  };

  const handleAssignment = async (headerIndex, userId, type = 'header') => {
    try {
      console.log('Assigning task:', { headerIndex, userId, type, taskId: task._id });
      
      const response = await fetch(`/api/ai/tasks/${task._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          headerIndex, 
          userId, 
          type 
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Assignment response:', data);
        
        if (data.success && data.data && data.data.task) {
          if (onAssignmentChanged) {
            try {
              onAssignmentChanged(data.data.task);
            } catch (callbackError) {
              console.error('Error in onAssignmentChanged callback:', callbackError);
            }
          }
        } else {
          console.error('Invalid response structure:', data);
        }
      } else {
        const errorData = await response.json();
        console.error('Assignment failed:', errorData);
      }
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  if (!task.isGroupTask || !task.taskHeaders) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
        <UsersIcon className="w-4 h-4" />
        <span>Group Task Structure</span>
      </div>
      
      {task.taskHeaders.map((header, headerIndex) => (
        <div key={headerIndex} className="bg-slate-700/30 rounded-lg border border-slate-600/30">
          {/* Header */}
          <div 
            className="p-3 cursor-pointer flex items-center justify-between hover:bg-slate-600/20 transition-colors"
            onClick={() => toggleHeader(headerIndex)}
          >
            <div className="flex items-center gap-3">
              <h4 className="font-medium text-white">{header.title}</h4>
              {header.assignedTo && (
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <UserIcon className="w-3 h-3" />
                  <span>
                    {members.find(m => m._id === header.assignedTo)?.username || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={header.assignedTo || ''}
                onChange={(e) => handleAssignment(headerIndex, e.target.value, 'header')}
                className="text-xs bg-slate-600 text-white rounded px-2 py-1 border border-slate-500"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">Assign Header</option>
                {members.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.username}
                  </option>
                ))}
              </select>
              {expandedHeaders[headerIndex] ? 
                <ChevronUpIcon className="w-4 h-4 text-gray-400" /> : 
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              }
            </div>
          </div>

          {/* Subtasks */}
          {expandedHeaders[headerIndex] && (
            <div className="border-t border-slate-600/30 p-3 space-y-2">
              {header.subtasks.map((subtask, subtaskIndex) => (
                <div key={subtaskIndex} className="flex items-center gap-3 py-2">
                  <button
                    onClick={() => handleSubtaskToggle(headerIndex, subtaskIndex, !subtask.completed)}
                    className={`w-4 h-4 rounded border transition-colors ${
                      subtask.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-slate-400 hover:border-green-400'
                    }`}
                  >
                    {subtask.completed && (
                      <CheckCircleIcon className="w-3 h-3 text-white" />
                    )}
                  </button>
                  
                  <span className={`flex-1 text-sm ${
                    subtask.completed ? 'text-gray-400 line-through' : 'text-gray-200'
                  }`}>
                    {subtask.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupTaskDisplay;
