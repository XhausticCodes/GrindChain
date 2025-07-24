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

  return (
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
      </div>
    </header>
  );
};

export default TopBar;
