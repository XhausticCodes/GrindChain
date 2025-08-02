import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import UpcomingTasks from "../components/UpcomingTasks";
import TeamSummary from "../components/TeamSummary";
import TermsAndConditions from "../components/TermsAndConditions";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    tasks: [],
    analytics: null,
    loading: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch both tasks and analytics data
      const [tasksResponse, analyticsResponse] = await Promise.all([
        fetch("/api/ai/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/ai/analytics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const tasksData = await tasksResponse.json();
      const analyticsData = await analyticsResponse.json();

      setDashboardData({
        tasks: tasksData.success ? tasksData.data.tasks : [],
        analytics: analyticsData.success ? analyticsData.data : null,
        loading: false,
      });

      // Debug the analytics data
      if (analyticsData.success && analyticsData.data.progressOverTime) {
        console.log("📊 Progress Over Time Data:", analyticsData.data.progressOverTime);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleNewTask = () => {
    navigate("/tasks");
  };

  const handleDiscover = () => {
    navigate("/analytics");
  };

  // Calculate real-time stats
  const inProgressTasks = dashboardData.tasks.filter(
    (task) => !task.completed
  ).length;
  const completedTasks = dashboardData.tasks.filter(
    (task) => task.completed
  ).length;
  const totalTasks = dashboardData.tasks.length;

  const inProgressPercent =
    totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const completedPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get upcoming tasks (all incomplete tasks)
  const upcomingTasks = dashboardData.tasks
    .filter((task) => !task.completed)
    .map((task) => ({
      title: task.title,
      date: task.createdAt
        ? new Date(task.createdAt).toLocaleDateString()
        : "No date",
      priority: task.priority,
    }));

  return (
    <div className="flex flex-col h-full min-h-0 p-4 gap-3 overflow-hidden">
      {/* Top row: WelcomeBanner and StatCards */}
      <div className="flex flex-row gap-4 items-stretch w-full h-[140px]">
        <div className="flex-1 min-w-0">
          <WelcomeBanner
            user={user}
            onNewTask={handleNewTask}
            onDiscover={handleDiscover}
          />
        </div>
        <div className="flex flex-row gap-3 items-stretch">
          <StatCard
            title="In Progress"
            value={inProgressTasks}
            total={totalTasks}
            percent={inProgressPercent}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            loading={dashboardData.loading}
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            total={totalTasks}
            percent={completedPercent}
            color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            loading={dashboardData.loading}
          />
        </div>
      </div>
      {/* Second row: Main content grid */}
      <div className="flex flex-row gap-4 w-full flex-1 min-h-0">
        {/* Left: ProgressChart (large) */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0 h-full">
          <div className="flex-1 min-h-[200px]">
            <ProgressChart
              data={dashboardData.analytics?.progressOverTime || []}
              loading={dashboardData.loading}
            />
          </div>
          <div className="h-16">
            <TermsAndConditions />
          </div>
        </div>

        {/* Right: UpcomingTasks (large) */}
        <div className="w-[320px] min-w-[280px] flex flex-col gap-3 min-h-0 h-full">
          <div className="flex-1 min-h-[200px]">
            <UpcomingTasks
              tasks={upcomingTasks}
              loading={dashboardData.loading}
            />
          </div>
          <div className="h-16">
            <TeamSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
