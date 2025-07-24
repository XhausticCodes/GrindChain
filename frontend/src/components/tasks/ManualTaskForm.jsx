import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManualTaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    duration: '1 week',
    roadmapItems: ['']
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoadmapItemChange = (index, value) => {
    const newItems = [...formData.roadmapItems];
    newItems[index] = value;
    setFormData(prev => ({
      ...prev,
      roadmapItems: newItems
    }));
  };

  const addRoadmapItem = () => {
    setFormData(prev => ({
      ...prev,
      roadmapItems: [...prev.roadmapItems, '']
    }));
  };

  const removeRoadmapItem = (index) => {
    if (formData.roadmapItems.length > 1) {
      const newItems = formData.roadmapItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        roadmapItems: newItems
      }));
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
          .filter(item => item.trim())
          .map((item, index) => ({
            text: item.trim(),
            completed: false,
            order: index
          })),
        aiGenerated: false
      };

      const response = await fetch('/api/ai/create-manual-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();

      if (data.success) {
        onTaskCreated(data.data.task);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          duration: '1 week',
          roadmapItems: ['']
        });
      } else {
        console.error('Failed to create task:', data.message);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-t-2xl p-4">
        <div className="flex items-center gap-3">
          <PlusIcon className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Create Manual Task
            </h2>
            <p className="text-sm text-gray-400">Design your own productivity journey</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-black/20 backdrop-blur-sm border-x border-blue-500/30 p-6 overflow-y-auto">
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

          {/* Roadmap Items */}
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
                    onChange={(e) => handleRoadmapItemChange(index, e.target.value)}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {loading ? 'Creating Task...' : 'Create Task'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-b-2xl p-4">
        <div className="text-center text-sm text-gray-400">
          ✨ Craft your perfect productivity plan ✨
        </div>
      </div>
    </div>
  );
};

export default ManualTaskForm;