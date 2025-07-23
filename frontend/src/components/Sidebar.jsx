import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "HOME", path: "/dashboard" },
    { name: "TASKS", path: "/tasks" },
    { name: "ANALYTICS", path: "/analytics" },
    { name: "CHATROOM", path: "/chatroom" },
    { name: "NOTIFICATIONS", path: "/notifications" },
    { name: "PROFILE", path: "/profile" },
  ];

  return (
    <aside
      className="blur-theme2 w-[240px] bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl h-full flex flex-col"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      <h1 className="text-3xl text-center font-semibold mb-4 tracking-widest text-yellow-500">GRINDCHAIN</h1>
      <nav className="flex flex-col space-y-5 flex-1">
        {navItems.map((item, idx) => (
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
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

//   return (
//     <aside className="h-[400px] w-[240px] bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl">
//       <h1 className="text-xl font-bold mb-4">GrindChain</h1>
//       <nav className="flex flex-col space-y-6">
//         {navItems.map((item, idx) => (
//           <button
//             key={idx}
//             className={`text-left text-white hover:text-accent ${
//               idx === 0 ? "text-accent font-semibold" : ""
//             }`}
//           >
//             {item.name}
//           </button>

//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
