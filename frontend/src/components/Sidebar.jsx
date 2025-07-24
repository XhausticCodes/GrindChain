import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const navItems = [
    { name: "HOME", path: "/dashboard" },
    { name: "TASKS", path: "/tasks" },
    { name: "ANALYTICS", path: "/analytics" },
    // Removed NOTIFICATIONS
    // We'll insert Create Group/Chatroom before PROFILE
    { name: "PROFILE", path: "/profile" },
  ];

  return (
    <aside
      className="blur-theme2 w-[240px] bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl h-full flex flex-col"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      <h1 className="text-3xl text-center font-semibold mb-4 tracking-widest text-yellow-500">
        GRINDCHAIN
      </h1>
      <nav className="flex flex-col space-y-5 flex-1">
        {navItems.map((item, idx) => {
          // Insert Create Group/Chatroom before PROFILE
          if (item.name === "PROFILE") {
            return (
              <>
                {user.groupID ? (
                  <NavLink
                    to={`/chatRoom/${user.groupID}`}
                    className={({ isActive }) =>
                      `text-left px-3 py-1 text-white hover:text-yellow-500 hover:bg-white/20 rounded-sm text-xl tracking-widest ${
                        isActive ? "text-yellow-600 bg-white/10" : ""
                      }`
                    }
                  >
                    CHAT ROOM
                  </NavLink>
                ) : (
                  <NavLink
                    to="/create-group"
                    className={({ isActive }) =>
                      `text-left px-3 py-1 text-white hover:text-yellow-500 hover:bg-white/20 rounded-sm text-xl tracking-widest ${
                        isActive ? "text-yellow-600 bg-white/10" : ""
                      }`
                    }
                  >
                    CREATE GROUP
                  </NavLink>
                )}
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-left px-3 py-1 text-white hover:text-yellow-500 hover:bg-white/20 rounded-sm text-xl tracking-widest ${
                      isActive ? "text-yellow-600 bg-white/10" : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </>
            );
          }
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `text-left px-3 py-1 text-white hover:text-yellow-500 hover:bg-white/20 rounded-sm text-xl tracking-widest ${
                  isActive ? "text-yellow-600 bg-white/10" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;