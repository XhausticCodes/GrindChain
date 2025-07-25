import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import farewellToDobby from "../assets/music/25 - Farewell To Dobby - Harry Potter and the Deathly Hallows Soundtrack (Alexandre Desplat).mp3";
import harrysWondrousWorld from "../assets/music/Harry's Wondrous World (Extended Version).mp3";
import theArrivalOfBabyHarry from "../assets/music/The Arrival of Baby Harry.mp3";
import leavingHogwarts from "../assets/music/Leaving Hogwarts.mp3";
import musicPlayerLogo from "../assets/musicplayerlogo.jpg";

const THEME_OPTIONS = [
  { key: "castle", label: "Magic Castle" },
  { key: "aurora", label: "Celestial Clouds" },
  { key: "cloudy", label: "Hogwarts Library" },
];

const MUSIC_FILES = [
  {
    name: "Leaving Hogwarts",
    src: leavingHogwarts,
  },
  {
    name: "Farewell To Dobby",
    src: farewellToDobby,
  },
  {
    name: "Harry's Wondrous World (Extended Version)",
    src: harrysWondrousWorld,
  },
  {
    name: "The Arrival of Baby Harry",
    src: theArrivalOfBabyHarry,
  },
];

const TopBar = ({ user, onLogout, theme, setTheme }) => {
  const [open, setOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    setCurrentTrack((prev) => (prev + 1) % MUSIC_FILES.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrack(
      (prev) => (prev - 1 + MUSIC_FILES.length) % MUSIC_FILES.length
    );
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        if (MUSIC_FILES.length === 1) {
          // Repeat the single song
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else {
          // Go to next song, loop to first if at end
          setCurrentTrack((prev) => (prev + 1) % MUSIC_FILES.length);
          setIsPlaying(true);
        }
      };
    }
  }, [currentTrack]);

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
        {/* Music Player Button */}
        <div className="relative flex items-center gap-2">
          <button
            className="p-0 m-0 bg-transparent border-none outline-none focus:outline-none hover:scale-110 transition-transform duration-200 disabled:opacity-40 cursor-pointer"
            onClick={playPrev}
            disabled={MUSIC_FILES.length <= 1}
            aria-label="Previous song"
            style={{ zIndex: 2 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12L18 19V5L8 12Z"
                fill="#a78bfa"
                stroke="#6d28d9"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <rect
                x="4.5"
                y="5"
                width="2"
                height="14"
                rx="1"
                fill="#c4b5fd"
                stroke="#6d28d9"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <div className="relative group flex items-center justify-center">
            <img
              src={musicPlayerLogo}
              alt="Music Player Logo"
              className={`w-14 h-14 rounded-full object-fill border-2 border-purple-400 shadow-lg cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-400/40 ${
                isPlaying
                  ? "ring-4 ring-purple-400/40 animate-pulse music-spin"
                  : ""
              }`}
              onClick={playPause}
              style={{
                boxShadow: isPlaying
                  ? "0 0 12px 4px rgba(121, 18, 224, 0.2), 0 0 20px 6px rgba(18, 66, 224, 0.2)"
                  : "",
              }}
            />
            {/* Magical glow effect on hover and when playing */}
            <div
              className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-300 ${
                isPlaying
                  ? "bg-purple-300/30 blur-lg opacity-80"
                  : "bg-purple-400/20 blur-lg opacity-0 group-hover:opacity-60"
              }`}
            ></div>
            {/* Play/Pause overlay icon removed as per new design */}
          </div>
          <button
            className="p-0 m-0 bg-transparent border-none outline-none focus:outline-none hover:scale-110 transition-transform duration-200 disabled:opacity-40 cursor-pointer"
            onClick={playNext}
            disabled={MUSIC_FILES.length <= 1}
            aria-label="Next song"
            style={{ zIndex: 2 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 12L6 5V19L16 12Z"
                fill="#a78bfa"
                stroke="#6d28d9"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <rect
                x="17.5"
                y="5"
                width="2"
                height="14"
                rx="1"
                fill="#c4b5fd"
                stroke="#6d28d9"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <audio
            ref={audioRef}
            src={MUSIC_FILES[currentTrack].src}
            preload="auto"
            style={{ display: "none" }}
          />
        </div>
        {/* Theme Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-lg shadow transition-all focus:outline-none cursor-pointer hover:shadow-yellow-400/20 hover:shadow-lg"
            onClick={() => setOpen((prev) => !prev)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            id="theme-dropdown-btn"
          >
            <span className="font-semibold text-xs">🎨 Theme</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
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
                      setOpen(false);
                    }}
                  >
                    <span className="flex-1">{option.label}</span>
                    {theme === option.key && (
                      <span className="text-yellow-400">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Avatar Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            id="user-avatar-btn"
            className="focus:outline-none cursor-pointer relative group"
            onClick={() => setUserDropdown((prev) => !prev)}
            type="button"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg group-hover:scale-110 group-hover:border-yellow-400 transition-all duration-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-3xl border-2 border-yellow-400/60 shadow-lg group-hover:scale-110 group-hover:border-yellow-400 transition-all duration-300">
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
