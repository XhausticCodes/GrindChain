import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import UpcomingTasks from "../components/UpcomingTasks";
import TeamSummary from "../components/TeamSummary";
// import CalendarPanel from "../components/CalendarPanel";

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-row gap-6">
          <WelcomeBanner />
          {/* <CalendarPanel /> */}
          <div className="flex gap-6">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressChart />
          <UpcomingTasks />
        </div>
        <TeamSummary />
      </div>
    </>
  );
};

export default Dashboard;
