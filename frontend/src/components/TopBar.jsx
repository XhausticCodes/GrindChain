import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";


const THEME_OPTIONS = [
  { key: "castle", label: "Magic Castle" },
  { key: "aurora", label: "Aurora" },
  { key: "cloudy", label: "Cloudy" },

import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

const THEME_OPTIONS = [
  { key: "default", label: "Default Particles" },
  { key: "aurora", label: "Aurora Borealis" },
  { key: "galaxy", label: "Starry Galaxy" },
  { key: "iridescence", label: "Iridescence" },
  { key: "potter", label: "Harry Potter" },

];

const TopBar = ({ user, onLogout, theme, setTheme }) => {
  const [open, setOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {

        setUserDropdown(false);

        setShowUserDropdown(false);
      }
      if (!e.target.closest("#theme-dropdown-btn") && !e.target.closest("#theme-dropdown")) {
        setShowDropdown(false);

      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-b border-purple-500/20 flex justify-between items-center px-6 py-3 shadow-xl relative z-50">
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
        <div className="relative" ref={dropdownRef}>
          <button

            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg shadow hover:from-yellow-500 hover:to-amber-700 transition-all focus:outline-none cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}

            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white rounded-lg shadow transition-all focus:outline-none"
            onClick={() => setShowDropdown((prev) => !prev)}

            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="font-semibold text-xs">🎨 Theme</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
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

          {open && (
            <ul
              className="absolute right-0 mt-2 w-40 text-black bg-white rounded-lg shadow-lg z-20 border border-gray-200 animate-fade-in"
              role="listbox"
            >
              {THEME_OPTIONS.map((option) => (
                <li
                  key={option.key}
                  role="option"
                  aria-selected={theme === option.key}
                  className={`px-4 py-2 hover:bg-yellow-500 cursor-pointer flex items-center rounded-lg gap-2 ${
                    theme === option.key
                      ? "bg-yellow-200 font-bold text-yellow-800"
                      : ""
                  }`}
                  onClick={() => {
                    setTheme(option.key);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {theme === option.key && <span className="ml-auto">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            id="user-avatar-btn"
            className="focus:outline-none cursor-pointer"
            onClick={() => setUserDropdown((prev) => !prev)}

          {showDropdown && (
            <div 
              id="theme-dropdown"
              className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl z-[9999] border border-purple-500/30"
            >
              <div className="px-3 py-2 border-b border-purple-500/20 text-slate-300 font-semibold text-xs">
                🎨 Choose Background Theme
              </div>
              <ul className="py-2 text-slate-300">
                {THEME_OPTIONS.map((option) => (
                  <li
                    key={option.key}
                    className={`px-4 py-2 hover:bg-purple-600/20 cursor-pointer flex items-center gap-2 text-sm transition-colors ${
                      theme === option.key
                        ? "bg-purple-600/30 font-bold text-yellow-400"
                        : ""
                    }`}
                    onClick={() => {
                      setTheme(option.key);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="flex-1">{option.label}</span>
                    {theme === option.key && <span className="text-yellow-400">✓</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            id="user-avatar-btn"
            className="focus:outline-none cursor-pointer relative group"
            onClick={() => setShowUserDropdown((prev) => !prev)}

            type="button"
          >
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
          </button>

          {userDropdown && (
            <div
              id="user-avatar-dropdown"
              className="absolute right-0 mt-2 min-w-[12rem] max-w-[18rem] bg-white rounded-xl shadow-2xl z-30 border border-gray-200 animate-fade-in flex flex-col overflow-hidden"
              role="menu"
              tabIndex={-1}
              aria-label="User menu"
            >
              {/* User Info Section */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-yellow-50">
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
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-bold text-yellow-800 truncate"
                    title={user?.username || "User"}
                  >
                    {user?.username || "User"}
                  </span>
                  {user?.email && (
                    <span
                      className="text-xs text-gray-500 truncate"
                      title={user.email}
                    >
                      {user.email}
                    </span>
                  )}
                </div>

          
          {showUserDropdown && (
            <div
              id="user-avatar-dropdown"
              className="absolute right-0 mt-2 min-w-[8rem] bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl z-[9999] border border-purple-500/30"
            >
              <div className="px-4 py-2 border-b border-purple-500/20 text-slate-300 font-semibold flex items-center justify-center gap-2 text-center">
                <NavLink
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  title={user?.username || "User"}
                  className={({ isActive }) =>
                    `px-3 py-1 rounded transition-colors font-bold cursor-pointer outline-none max-w-[10rem] truncate text-sm ${
                      isActive ? "text-yellow-400" : "text-slate-300 hover:text-yellow-400"
                    }`
                  }
                >
                  {user?.username || "User"}
                </NavLink>

              </div>
              {/* Menu Options */}
              <NavLink
                to="/profile"
                onClick={() => setUserDropdown(false)}
                className={({ isActive }) =>
                  `block px-5 py-2 text-left w-full text-sm font-medium bg-yellow-200 transition-colors cursor-pointer outline-none hover:bg-yellow-300 focus:bg-yellow-400 border-b border-gray-100 last:border-b-0 ${
                    isActive ? "text-yellow-800 bg-yellow-200" : "text-gray-800"
                  }`
                }
                role="menuitem"
                tabIndex={0}
              >
                Profile
              </NavLink>
              <button

                onClick={onLogout}
                className="block px-5 py-2 text-left w-full text-sm font-semibold text-white bg-red-500 hover:bg-red-700 focus:bg-red-600 transition-colors rounded-b-xl cursor-pointer"
                role="menuitem"
                tabIndex={0}

                onClick={() => {
                  onLogout();
                  setShowUserDropdown(false);
                }}
                className="w-full text-center px-4 py-2 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-b-lg transition-all font-semibold cursor-pointer text-sm"

              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
