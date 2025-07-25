import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

const THEME_OPTIONS = [
  { key: "castle", label: "Magic Castle" },
  { key: "aurora", label: "Aurora" },
  { key: "cloudy", label: "Cloudy" },
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
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg shadow hover:from-yellow-500 hover:to-amber-700 transition-all focus:outline-none cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
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
