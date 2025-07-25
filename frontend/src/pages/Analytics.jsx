import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  TrophyIcon,
  CalendarIcon,
  ListBulletIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import whiteOwl from "../assets/whiteOwl.png";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/ai/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <img
            src={whiteOwl}
            alt="Loading Owl"
            className="w-60 h-60 animate-bounce-rotate-slow drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 0 32px #fff8)" }}
          />
          <p
            className="mt-6 text-6xl font-bold text-yellow-500 animate-pulse"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(120,_119,_198,_0.3),_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(147,_51,_234,_0.2),_transparent_50%)]"></div>
        </div> */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No analytics data available</p>
            <p className="text-gray-500 text-sm">
              Create some tasks to see analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  const priorityColors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  };

  const priorityData = [
    {
      name: "High Priority",
      value: analytics.priorityBreakdown.high,
      color: priorityColors.high,
    },
    {
      name: "Medium Priority",
      value: analytics.priorityBreakdown.medium,
      color: priorityColors.medium,
    },
    {
      name: "Low Priority",
      value: analytics.priorityBreakdown.low,
      color: priorityColors.low,
    },
  ].filter((item) => item.value > 0);

  const completionRate =
    analytics.totalTasks > 0
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
      : 0;

  return (
    <div className="relative h-full w-full overflow-hidden scrollbar-hide scrollbar-none">
      {/* Mystical Background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(120,_119,_198,_0.3),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(147,_51,_234,_0.2),_transparent_50%)]"></div>
      </div> */}

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto p-6 scrollbar-none hide-scrollbar">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1
              className="text-3xl  font-bold bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2 tracking-wider analytics-glow"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              TASK ANALYTICS DASHBOARD
            </h1>
            <p className="text-gray-200">
              Track your productivity and task completion metrics
            </p>
          </div>
          <div>
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FireIcon className="w-8 h-8 text-orange-400" />
                  <p className="text-gray-400 text-sm">Total Streak</p>
                  <p className="text-2xl font-bold text-white">{user.streak}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.totalTasks}
                </p>
              </div>
              <ListBulletIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {analytics.completedTasks}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {analytics.totalTasks - analytics.completedTasks}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-400">
                  {completionRate}%
                </p>
              </div>
              <TrophyIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Progress Over Time */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" />
              Progress Trend (Last 7 Days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.progressOverTime}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgProgress"
                    stroke="#9333ea"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#9333ea" }}
                    activeDot={{ r: 6, fill: "#9333ea" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
              <FlagIcon className="w-5 h-5" />
              Priority Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Task Progress Details */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 mb-6">
          <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
            <ListBulletIcon className="w-5 h-5" />
            Individual Task Progress
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analytics.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate font-medium">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : task.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {task.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-purple-400 font-medium min-w-[40px]">
                    {task.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress Summary */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
          <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5" />
            Overall Progress Summary
          </h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Average Task Progress</span>
              <span className="text-gray-400">{analytics.avgProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${analytics.avgProgress}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {analytics.completedTasks}
              </p>
              <p className="text-xs text-gray-400">Tasks Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {analytics.totalTasks - analytics.completedTasks}
              </p>
              <p className="text-xs text-gray-400">Tasks Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {completionRate}%
              </p>
              <p className="text-xs text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
