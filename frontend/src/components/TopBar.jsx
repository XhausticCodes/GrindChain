<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
=======
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// const Topbar = () => {
//   return (
//     <header className="blur-theme flex justify-between items-center px-6 py-4 bg-card shadow-md rounded-bl-3xl">

const THEME_OPTIONS = [
  { key: "default", label: "Default" },
  { key: "aurora", label: "Aurora" },
  { key: "galaxy", label: "Galaxy" },
  { key: "iridescence", label: "Iridescence" },
  { key: "potter", label: "Potter" },
];

const TopBar = ({ user, onLogout, theme, setTheme }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        !e.target.closest("#user-avatar-dropdown") &&
        !e.target.closest("#user-avatar-btn")
      ) {
        setShowUserDropdown(false);
      }
      if (!e.target.closest("#theme-dropdown-btn")) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
>>>>>>> 9abeb2a2179df3bd05b73b46a10436a49fa5af96

  return (
<<<<<<< HEAD
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
=======
    <header className="blur-theme2 flex justify-between items-center px-6 py-4 bg-card shadow-md rounded-bl-3xl z-99999">
      {/* Left: Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="bg-dark text-white px-4 py-2 rounded-lg outline-none w-1/3 bg-white/10"
      />
      {/* Right: Theme Dropdown and Avatar */}
      <div className="flex items-center gap-4">
        {/* Theme Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg shadow hover:from-yellow-500 hover:to-amber-700 transition-all focus:outline-none cursor-pointer"
            onClick={() => setShowDropdown((prev) => !prev)}
            type="button"
            id="theme-dropdown-btn"
>>>>>>> 9abeb2a2179df3bd05b73b46a10436a49fa5af96
          >
            <span className="font-semibold">Theme</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
<<<<<<< HEAD
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
=======
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-200 animate-fade-in">
              <ul className="py-2 text-gray-700">
                {THEME_OPTIONS.map((option) => (
                  <li
                    key={option.key}
                    className={`px-4 py-2 hover:bg-yellow-100 cursor-pointer flex items-center gap-2 ${
                      theme === option.key
                        ? "bg-yellow-200 font-bold text-yellow-800"
                        : ""
                    }`}
                    onClick={() => {
                      setTheme(option.key);
                      setShowDropdown(false);
                    }}
                  >
                    {option.label}
                    {theme === option.key && <span className="ml-auto">✓</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            id="user-avatar-btn"
            className="focus:outline-none cursor-pointer"
            onClick={() => setShowUserDropdown((prev) => !prev)}
            type="button"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-3xl">
                🧙🏻‍♂️
              </div>
            )}
          </button>
          {showUserDropdown && (
            <div
              id="user-avatar-dropdown"
              className="absolute right-0 mt-2 min-w-[8rem] max-w-[16rem] bg-yellow-500 rounded-lg shadow-lg z-30 border border-gray-200 animate-fade-in"
            >
              <div className="px-4 py-1 border-b border-gray-100 text-gray-800 font-semibold flex items-center justify-center gap-2 text-center">
                <NavLink
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  title={user?.username || "User"}
                  className={({ isActive }) =>
                    `px-3 py-1 rounded transition-colors font-bold cursor-pointer outline-none max-w-[10rem] truncate ${
                      isActive ? " text-yellow-800" : "text-black"
                    }`
                  }
                >
                  {user?.username || "User"}
                </NavLink>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-center px-4 py-2 text-black bg-red-500 hover:bg-red-300 rounded-b-lg transition-colors font-semibold cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
>>>>>>> 9abeb2a2179df3bd05b73b46a10436a49fa5af96
      </div>
    </header>
  );
};

export default TopBar;