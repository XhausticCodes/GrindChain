import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React, { useState } from "react";

const Sidebar = () => {
  const { user, loading } = useAuth();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [parentHovered, setParentHovered] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  const navItems = [
    { name: "HOME", path: "/dashboard" },
    { name: "TASKS", path: "/tasks" },
    { name: "ANALYTICS", path: "/analytics" },
    { name: "PROFILE", path: "/profile" },
  ];

  return (
    <aside
      className="blur-theme2 w-full bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl h-full flex flex-col"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      <h1 className="text-3xl text-center font-semibold mb-4 tracking-widest text-yellow-500 analytics-glow border-b-1 border-yellow-500 pb-2">
        GRINDHUB
      </h1>
      <nav className="flex flex-col space-y-5 flex-1">
        <div
          className="flex flex-col gap-2"
          onMouseEnter={() => setParentHovered(true)}
          onMouseLeave={() => {
            setParentHovered(false);
            setHoveredIdx(null);
          }}
        >
          {navItems.map((item, idx) => {
            // Insert Create Group/Chatroom before PROFILE
            if (item.name === "PROFILE") {
              return (
                <React.Fragment key={idx}>
                  {user.currentGroupId ? (
                    <NavLink
                      to={`/chatroom`}
                      className={({ isActive }) => {
                        const isBig = parentHovered
                          ? hoveredIdx === "chatroom"
                          : false;
                        return `text-left px-3 py-2 my-2 text-white text-xl tracking-widest rounded-lg transition-all duration-300 hover:bg-slate-600/30 hover:shadow-lg hover:text-yellow-500 ${
                          isBig ||
                          (isActive && !parentHovered && hoveredIdx === null)
                            ? "scale-110 z-10"
                            : parentHovered
                            ? "scale-90"
                            : ""
                        } ${isActive ? "text-yellow-600 bg-white/10" : ""}`;
                      }}
                      onMouseEnter={() => setHoveredIdx("chatroom")}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      CHAT ROOM
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/create-group"
                      className={({ isActive }) => {
                        const isBig = parentHovered
                          ? hoveredIdx === "creategroup"
                          : false;
                        return `text-left px-3 py-2 my-2 text-white text-xl tracking-widest rounded-lg transition-all duration-300 hover:bg-slate-600/30 hover:shadow-lg hover:text-yellow-500 ${
                          isBig ||
                          (isActive && !parentHovered && hoveredIdx === null)
                            ? "scale-110 z-10"
                            : parentHovered
                            ? "scale-90"
                            : ""
                        } ${isActive ? "text-yellow-600 bg-white/10" : ""}`;
                      }}
                      onMouseEnter={() => setHoveredIdx("creategroup")}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      CREATE GROUP
                    </NavLink>
                  )}
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => {
                      const isBig = parentHovered ? hoveredIdx === idx : false;
                      return `text-left px-3 py-2 my-2 text-white text-xl tracking-widest rounded-lg transition-all duration-300 hover:bg-slate-600/30 hover:shadow-lg hover:text-yellow-500 ${
                        isBig ||
                        (isActive && !parentHovered && hoveredIdx === null)
                          ? "scale-110 z-10"
                          : parentHovered
                          ? "scale-90"
                          : ""
                      } ${isActive ? "text-yellow-600 bg-white/10" : ""}`;
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {item.name}
                  </NavLink>
                </React.Fragment>
              );
            }
            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) => {
                  const isBig = parentHovered ? hoveredIdx === idx : false;
                  return `text-left px-3 py-2 my-2 text-white text-xl tracking-widest rounded-lg transition-all duration-300 hover:bg-slate-600/30 hover:shadow-lg hover:text-yellow-500 ${
                    isBig || (isActive && !parentHovered && hoveredIdx === null)
                      ? "scale-110 z-10"
                      : parentHovered
                      ? "scale-90"
                      : ""
                  } ${isActive ? "text-yellow-600 bg-white/10" : ""}`;
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
