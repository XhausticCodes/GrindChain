import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Tasks", path: "/tasks" },
    { name: "Analytics", path: "/analytics" },
    { name: "Chatroom", path: "/chatroom" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <aside className="blur-theme w-[240px] bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl h-full flex flex-col">
      <h1 className="text-xl font-bold mb-4">GrindChain</h1>
      <nav className="flex flex-col space-y-6 flex-1">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `text-left text-white hover:text-accent ${
                isActive ? "text-accent font-semibold" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
