import React, { useState, useEffect } from 'react';
import TaskChatbot from '../components/tasks/TaskChatbot';
import TaskList from '../components/tasks/TaskList';
import ManualTaskForm from '../components/tasks/ManualTaskForm';
import { SparklesIcon, UserIcon } from '@heroicons/react/24/outline';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAIMode, setIsAIMode] = useState(false); // Start with manual mode

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/ai/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskGenerated = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
<<<<<<< HEAD
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(120,_119,_198,_0.3),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(147,_51,_234,_0.2),_transparent_50%)]"></div>
      </div>

      {/* Mode Toggle */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-1 flex">
          <button
            onClick={() => setIsAIMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              !isAIMode 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Manual
          </button>
          <button
            onClick={() => setIsAIMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isAIMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            AI Assistant
          </button>
        </div>
      </div>

=======
      
>>>>>>> a0e385dd3d5c8a5d83870937b1e8d7f743e0ec62
      {/* Main Content */}
      <div className="relative z-10 h-full flex gap-6 p-6 pt-20">
        {/* Left Side - Task Creation */}
        <div className="w-1/2 h-full">
          {isAIMode ? (
            <TaskChatbot onTaskGenerated={handleTaskGenerated} />
          ) : (
            <ManualTaskForm onTaskCreated={handleTaskGenerated} />
          )}
        </div>

        {/* Right Side - Task List */}
        <div className="w-1/2 h-full">
          <TaskList 
            tasks={tasks} 
            loading={loading}
            onTaskDeleted={handleTaskDeleted}
            onTaskUpdated={handleTaskUpdated}
            onRefresh={fetchTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;