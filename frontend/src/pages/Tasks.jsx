import React, { useState, useEffect } from 'react';
import TaskChatbot from '../components/tasks/TaskChatbot';
import TaskList from '../components/tasks/TaskList';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="relative h-full w-full overflow-hidden">
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex gap-6 p-6">
        {/* Left Side - Chatbot */}
        <div className="w-1/2 h-full">
          <TaskChatbot onTaskGenerated={handleTaskGenerated} />
        </div>

        {/* Right Side - Task List */}
        <div className="w-1/2 h-full">
          <TaskList 
            tasks={tasks} 
            loading={loading}
            onTaskDeleted={handleTaskDeleted}
            onRefresh={fetchTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;