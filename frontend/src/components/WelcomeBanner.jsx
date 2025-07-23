const WelcomeBanner = ({ user }) => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#4b2e1e] to-[#7b5232] p-8 rounded-2xl w-full min-h-[220px]">
      <div className="flex flex-col justify-center h-full">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome Back, {user?.username || "User"}!
        </h2>
        <p className="text-white text-base mb-6">
          Check your daily tasks and schedules
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-[#4b2e1e] font-semibold px-6 py-3 rounded-md text-lg shadow hover:bg-gray-200 transition">
            + New Task
          </button>
          <button className="bg-transparent border border-white text-white px-6 py-3 rounded-md text-lg hover:bg-white hover:text-[#4b2e1e] transition">
            Discover
          </button>
        </div>
      </div>
      <img
        src="/src/assets/Sorting_Hat.webp"
        alt="dashboard illustration"
        className="w-40 h-40 object-contain"
      />
    </div>
  );
};

export default WelcomeBanner;
