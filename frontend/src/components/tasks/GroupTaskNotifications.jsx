import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const GroupTaskNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/ai/task-notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/ai/task-notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification._id !== notificationId)
    );
  };

  if (loading || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification._id}
          className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 shadow-lg animate-slide-in-right"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'assignment' ? (
                <UsersIcon className="w-5 h-5 text-purple-400" />
              ) : notification.type === 'deadline' ? (
                <ClockIcon className="w-5 h-5 text-orange-400" />
              ) : (
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {notification.title}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {notification.message}
              </p>
              {notification.taskTitle && (
                <p className="text-xs text-purple-300 mt-1 font-medium">
                  Task: {notification.taskTitle}
                </p>
              )}
            </div>
            
            <button
              onClick={() => dismissNotification(notification._id)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          {notification.actionRequired && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => markAsRead(notification._id)}
                className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-2 py-1 rounded transition-colors"
              >
                Mark as Read
              </button>
              {notification.taskId && (
                <button
                  onClick={() => {
                    // Navigate to task or open task details
                    window.location.href = `/tasks#task-${notification.taskId}`;
                    markAsRead(notification._id);
                  }}
                  className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2 py-1 rounded transition-colors"
                >
                  View Task
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      {notifications.length > 3 && (
        <div className="text-center">
          <button 
            onClick={() => {/* Open notifications panel */}}
            className="text-xs text-purple-400 hover:text-purple-300 underline"
          >
            +{notifications.length - 3} more notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupTaskNotifications;
