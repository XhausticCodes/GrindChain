import React from "react";

const StatCard = ({ title, value, total, percent, color, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 p-5 rounded-xl shadow-xl w-[180px] h-full flex flex-col justify-center">
        <div className="animate-pulse">
          <div className="h-3 bg-slate-700 rounded w-3/4 mb-3"></div>
          <div className="h-6 bg-slate-700 rounded w-1/2 mb-3"></div>
          <div className="h-2 bg-slate-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 p-5 rounded-xl shadow-xl w-[180px] h-full flex flex-col justify-center hover:scale-105 transform transition-all duration-300 group">
      {/* Magical glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="text-xs text-slate-400 mb-2 font-medium">{title}</div>
        <div className="text-2xl font-bold mb-3">
          <span 
            className="bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: color }}
          >
            {value}
          </span>
          {total !== undefined && (
            <span className="text-sm text-slate-500 ml-1">/{total}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 rounded-full transition-all duration-500 shadow-sm"
              style={{
                backgroundImage: color,
                width: `${Math.min(percent, 100)}%`,
              }}
            />
          </div>
          <div className="text-xs text-slate-400 font-medium">{percent}%</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;