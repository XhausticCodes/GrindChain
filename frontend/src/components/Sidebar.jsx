import { NavLink } from "react-router-dom";
import { useAuth, } from "../contexts/AuthContext";

const Sidebar = () => {
  const {user, loading } = useAuth();

  if(loading) {
    return <div>Loading...</div>;
  }

  const navItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Tasks", path: "/tasks" },
    { name: "Analytics", path: "/analytics" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
    // { name: "Chatroom", path: "/chatroom/:groupID" },
  ];

  return (
    <aside className="blur-theme2 w-[240px] bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl h-full flex flex-col">
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
        {user.groupID ? (
          <NavLink
            to={`/chatRoom/${user.groupID}`}
            className={({ isActive }) =>
              `text-left text-white hover:text-accent ${
                isActive ? "text-accent font-semibold" : ""
              }`
            }
          >
            ChatRoom
          </NavLink>
        ) : (
          <NavLink
            to="/create-group"
            className={({ isActive }) =>
              `text-left text-white hover:text-accent ${
                isActive ? "text-accent font-semibold" : ""
              }`
            }
          >
            Create Group
          </NavLink>
        )}
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
