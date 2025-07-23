import React from "react";
import { useAuth } from "../contexts/AuthContext";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import UpcomingTasks from "../components/UpcomingTasks";
import TeamSummary from "../components/TeamSummary";
import TermsAndConditions from "../components/TermsAndConditions";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full min-h-0 p-3 gap-3 overflow-hidden">
      {/* Top row: WelcomeBanner and StatCards */}
      <div className="flex flex-row gap-3 items-stretch w-full min-h-[180px]">
        <div className="flex-1 min-w-0">
          <WelcomeBanner user={user} />
        </div>
        <div className="flex flex-row gap-3 items-stretch">
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
      {/* Second row: ProgressChart/TermsAndConditions and UpcomingTasks/TeamSummary */}
      <div className="flex flex-row gap-3 w-full flex-1 min-h-0">
        {/* Left: ProgressChart (top) and TermsAndConditions (bottom) */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0 h-full">
          <div className="h-3/4 min-h-[180px]">
            <ProgressChart />
          </div>
          <div className="h-1/4 min-h-[60px] flex items-end">
            <TermsAndConditions />
          </div>
        </div>
        {/* Right: UpcomingTasks (top) and TeamSummary (bottom) */}
        <div className="w-[350px] min-w-[300px] flex flex-col gap-3 min-h-0 h-full">
          <div className="h-3/4 min-h-[180px]">
            <UpcomingTasks />
          </div>
          <div className="h-1/4 min-h-[60px] flex items-end">
            <TeamSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
