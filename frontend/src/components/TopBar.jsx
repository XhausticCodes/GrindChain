import { NavLink } from "react-router-dom";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

const TopBar = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-b border-purple-500/20 flex justify-between items-center px-6 py-3 shadow-xl">
      {/* Search Section */}
      <div className="relative w-1/3 max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, analytics..."
          className="w-full bg-slate-800/50 border border-slate-600/30 text-white pl-10 pr-4 py-2 rounded-lg outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all placeholder-slate-400 text-sm"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <NavLink 
            to="/notifications"
            className="relative p-2 rounded-lg bg-slate-800/30 hover:bg-slate-700/40 transition-all group"
          >
            <BellIcon className="w-5 h-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-slate-900 animate-pulse"></span>
          </NavLink>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-3">
          <NavLink 
            to="/profile"
            className="text-slate-300 text-sm hover:text-yellow-400 transition-colors font-medium"
          >
            {user?.username || "Wizard"}
          </NavLink>
          
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* User Avatar */}
        <NavLink to="/profile" className="relative group">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400/60 shadow-lg group-hover:scale-110 group-hover:border-yellow-400 transition-all duration-300"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-lg border-2 border-yellow-400/60 shadow-lg group-hover:scale-110 group-hover:border-yellow-400 transition-all duration-300">
              🧙🏻‍♂️
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900 group-hover:bg-green-300 transition-colors"></div>
          
          {/* Magical glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
        </NavLink>
      </div>
    </header>
  );
};

export default TopBar;