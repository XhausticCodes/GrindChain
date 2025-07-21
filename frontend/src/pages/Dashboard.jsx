import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import UpcomingTasks from "../components/UpcomingTasks";
import TeamSummary from "../components/TeamSummary";
import Pricing from "../components/Pricing";
// import CalendarPanel from "../components/CalendarPanel";

const Dashboard = () => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 justify-between">
      <Sidebar />
      <Pricing />
      </div>
      
      <main className="flex-1 space-y-6 bg-[#000000] min-h-screen">
        <TopBar />
        <div className="flex gap-6 flex-wrap">
        <WelcomeBanner />
        {/* <CalendarPanel /> */}
          <StatCard
            title="In-progress Projects"
            value={6}
            total={12}
            percent={60}
            color="#9333ea"
          />
          <StatCard
            title="Completed Projects"
            value={15}
            total={26}
            percent={90}
            color="#3b82f6"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressChart />
          <UpcomingTasks />
        </div>
        <TeamSummary />
      </main>
    </div>
  );
};

export default Dashboard;
