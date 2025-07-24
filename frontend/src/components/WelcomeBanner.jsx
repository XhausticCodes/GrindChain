import React from "react";

const WelcomeBanner = ({ user, onNewTask, onDiscover }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm border border-purple-500/30 p-4 rounded-xl w-full h-full shadow-2xl">
      {/* Magical background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-400/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10 flex items-center justify-between h-full">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent mb-1">
            Welcome Back, {user?.username || "Wizard"}! ✨
          </h2>
          <p className="text-slate-300 text-xs mb-3 opacity-90">
            Ready to conquer your magical productivity journey?
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onNewTask}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-4 py-2 rounded-lg text-xs shadow-lg hover:shadow-yellow-400/25 hover:scale-105 transform transition-all duration-200"
            >
              ⚡ New Task
            </button>
            <button 
              onClick={onDiscover}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/50 text-white px-4 py-2 rounded-lg text-xs hover:shadow-purple-400/25 hover:scale-105 transform transition-all duration-200"
            >
              🔮 Discover
            </button>
          </div>
        </div>
        
        {/* Compact User Avatar */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Magical glow effects */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-amber-500/30 blur-lg animate-pulse"></div>
          
          {/* Avatar container */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400/60 shadow-lg bg-slate-800/80 backdrop-blur-sm flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">🧙🏻‍♂️</span>
            )}
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-slate-900 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;