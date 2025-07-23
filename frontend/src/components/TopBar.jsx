// const Topbar = () => {
//   return (
//     <header className="blur-theme flex justify-between items-center px-6 py-4 bg-card shadow-md rounded-bl-3xl">

const TopBar = ({ user, onLogout }) => {
  return (
    <header className="blur-theme2 flex justify-between items-center px-6 py-4 bg-card shadow-md rounded-bl-3xl">
      <input
        type="text"
        placeholder="Search..."
        className="bg-dark text-white px-4 py-2 rounded-lg outline-none w-1/3"
      />
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          <button className="text-xl">🔔</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">{user?.username || "User"}</span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="w-8 h-8 bg-white rounded-full" />
      </div>
    </header>
  );
};

export default TopBar;
