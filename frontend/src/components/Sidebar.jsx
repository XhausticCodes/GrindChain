const Sidebar = () => {
  const navItems = [
    { name: "Home" },
    { name: "Tasks" },
    { name: "Analytics" },
    { name: "Chatroom" },
    { name: "Notifications" },
    { name: "Profile" },
  ];

  return (
    <aside className="h-[400px] w-[240px] bg-slate-900 px-6 py-8 space-y-8 rounded-br-3xl">
      <h1 className="text-xl font-bold mb-4">GrindChain</h1>
      <nav className="flex flex-col space-y-6">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={`text-left text-white hover:text-accent ${
              idx === 0 ? "text-accent font-semibold" : ""
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
