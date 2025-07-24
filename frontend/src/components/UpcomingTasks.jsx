import React from "react";
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";

const UpcomingTasks = ({ tasks = [], loading = false }) => {
  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl w-full h-full">
        <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">📅 Upcoming Tasks</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
              <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-slate-600 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayTasks = tasks.length > 0 ? tasks : [
    { title: "✨ Create your first task", date: "Today", priority: "medium" },
    { title: "📊 Explore the analytics", date: "Today", priority: "low" },
    { title: "🤖 Try the AI assistant", date: "Today", priority: "low" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "from-red-500 to-pink-500";
      case "medium": return "from-yellow-400 to-orange-500";
      case "low": return "from-green-400 to-emerald-500";
      default: return "from-blue-500 to-cyan-500";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "🔥";
      case "medium": return "⚡";
      case "low": return "🌟";
      default: return "📌";
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl w-full h-full">
      {/* Magical background effect */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-green-400" />
          {tasks.length > 0 ? "Upcoming Tasks" : "Get Started"}
        </h3>
        <ul className="space-y-2 overflow-y-auto max-h-[calc(100%-4rem)]">
          {displayTasks.map((task, idx) => (
            <li
              key={idx}
              className="group flex items-center gap-3 bg-slate-700/20 hover:bg-slate-600/30 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-slate-600/20"
            >
              <span className={`bg-gradient-to-r ${getPriorityColor(task.priority)} text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg`}>
                {getPriorityIcon(task.priority)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate group-hover:text-yellow-400 transition-colors">
                  {task.title}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <ClockIcon className="w-3 h-3" />
                  {task.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && (
          <div className="text-center mt-6 p-4 bg-slate-700/20 rounded-lg border border-slate-600/20">
            <SparklesIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              Ready to begin your magical journey?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingTasks;