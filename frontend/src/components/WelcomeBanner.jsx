const WelcomeBanner = () => {
  return (
    <div className="w-2/3 flex items-center justify-between bg-gradient-to-r from-accent to-secondaryAccent p-6 rounded-xl">
      <div>
        <h2 className="text-xl font-semibold">Welcome Back, UserName!</h2>
        <p className="text-white text-sm mt-1">
          Check your daily tasks and schedules
        </p>
        <div className="mt-4 flex gap-4">
          <button className="bg-white text-accent font-semibold px-4 py-2 rounded-md">
            + New Task
          </button>
          <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md">
            Discover
          </button>
        </div>
      </div>
      <img
        src="/src/assets/Sorting_Hat.webp"
        alt="dashboard illustration"
        className="w-32"
      />
    </div>
  );
};

export default WelcomeBanner;
