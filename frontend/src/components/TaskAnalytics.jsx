import React, { useState, useEffect } from 'react';
import { ChartBarIcon, CheckCircleIcon, ClockIcon, FlagIcon } from '@heroicons/react/24/outline';

const TaskAnalytics = ({ tasks, refreshTrigger }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]); // Refresh when tasks update

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/ai/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      console.log('Analytics response:', data); // Debug log
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
        <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" />
          Task Analytics
        </h3>
        <p className="text-gray-400 text-sm">No data available yet. Create some tasks to see analytics!</p>
      </div>
    );
  }

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
      <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
        <ChartBarIcon className="w-5 h-5" />
        Task Analytics
      </h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{analytics.completedTasks}</div>
          <div className="text-xs text-gray-400">Completed Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{analytics.totalTasks - analytics.completedTasks}</div>
          <div className="text-xs text-gray-400">Pending Tasks</div>
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Average Progress</span>
          <span className="text-sm text-gray-400">{analytics.avgProgress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${analytics.avgProgress}%` }}
          />
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="mb-4">
        <h4 className="text-sm text-gray-400 mb-3">Priority Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-300">High</span>
            </div>
            <span className="text-sm text-gray-400">{analytics.priorityBreakdown.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Medium</span>
            </div>
            <span className="text-sm text-gray-400">{analytics.priorityBreakdown.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Low</span>
            </div>
            <span className="text-sm text-gray-400">{analytics.priorityBreakdown.low}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-sm text-gray-400 mb-3">Recent Tasks</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {analytics.tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-300 truncate flex-1">{task.title}</span>
              <span className="text-xs text-purple-400 ml-2">{task.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;