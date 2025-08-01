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
  UsersIcon,
  UserIcon,
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
import { useNavigate } from "react-router-dom";
import whiteOwl from "../assets/whiteOwl.png";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [groupAnalytics, setGroupAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGroupView, setIsGroupView] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const fetchGroupAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ai/group-analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setGroupAnalytics(data.data);
        setIsGroupView(true);
      } else if (data.code === "NO_GROUP") {
        // User is not in any group, redirect to chatroom
        navigate("/chatroom");
        return;
      }
    } catch (error) {
      console.error("Error fetching group analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnalyticsView = () => {
    if (loading) return; // Prevent toggle during loading
    
    if (isGroupView) {
      // Switch back to personal analytics
      setIsGroupView(false);
      setLoading(false);
    } else {
      // Switch to group analytics
      fetchGroupAnalytics();
    }
  };

  // Get current analytics data based on view
  const currentAnalytics = isGroupView ? groupAnalytics : analytics;

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

  if (!currentAnalytics) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No analytics data available</p>
            <p className="text-gray-500 text-sm">
              {isGroupView ? "Create group tasks to see analytics" : "Create some tasks to see analytics"}
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
      value: currentAnalytics.priorityBreakdown.high,
      color: priorityColors.high,
    },
    {
      name: "Medium Priority",
      value: currentAnalytics.priorityBreakdown.medium,
      color: priorityColors.medium,
    },
    {
      name: "Low Priority",
      value: currentAnalytics.priorityBreakdown.low,
      color: priorityColors.low,
    },
  ].filter((item) => item.value > 0);

  const completionRate =
    currentAnalytics.totalTasks > 0
      ? Math.round((currentAnalytics.completedTasks / currentAnalytics.totalTasks) * 100)
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
              className="text-3xl font-bold bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2 tracking-wider analytics-glow"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              {isGroupView ? "GROUP ANALYTICS DASHBOARD" : "TASK ANALYTICS DASHBOARD"}
            </h1>
            <p className="text-gray-200">
              {isGroupView 
                ? "Track your group's collective productivity and progress" 
                : "Track your productivity and task completion metrics"
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Toggle Switch */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div className="relative">
                  <button
                    onClick={toggleAnalyticsView}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${
                      isGroupView 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={isGroupView}
                    aria-label="Toggle between personal and group analytics"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                        isGroupView ? 'translate-x-6 shadow-purple-500/20' : 'translate-x-1'
                      } ${loading ? 'animate-pulse' : ''}`}
                    />
                    {/* Loading indicator */}
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
                <UsersIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mt-2 text-center">
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isGroupView ? 'text-purple-400' : 'text-gray-400'
                }`}>
                  {loading ? 'Switching...' : (isGroupView ? "Group Analytics" : "Personal Analytics")}
                </span>
              </div>
            </div>
            
            {/* Streak Display */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FireIcon className="w-8 h-8 text-orange-400" />
                  <p className="text-gray-400 text-sm">
                    {isGroupView ? "Total Group Streak" : "Personal Streak"}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {isGroupView ? groupAnalytics?.totalStreak || 0 : user.streak}
                  </p>
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
                  {currentAnalytics.totalTasks}
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
                  {currentAnalytics.completedTasks}
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
                  {currentAnalytics.totalTasks - currentAnalytics.completedTasks}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {isGroupView ? "Group Members" : "Completion Rate"}
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {isGroupView ? `${groupAnalytics?.totalMembers || 0}` : `${completionRate}%`}
                </p>
              </div>
              {isGroupView ? (
                <UsersIcon className="w-8 h-8 text-blue-400" />
              ) : (
                <TrophyIcon className="w-8 h-8 text-blue-400" />
              )}
            </div>
          </div>
        </div>

        {/* Group Task Analytics Section - Only show for group view */}
        {isGroupView && groupAnalytics?.groupTaskAnalytics && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <UsersIcon className="w-6 h-6" />
              Group Task Structure Analytics
            </h2>
            
            {/* Group Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gradient-to-r from-emerald-800/50 to-emerald-900/50 backdrop-blur-sm border border-emerald-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-300 text-sm">Group Tasks</p>
                    <p className="text-2xl font-bold text-white">
                      {groupAnalytics.groupTaskAnalytics.totalGroupTasks}
                    </p>
                  </div>
                  <UsersIcon className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm">Individual Tasks</p>
                    <p className="text-2xl font-bold text-white">
                      {groupAnalytics.groupTaskAnalytics.totalIndividualTasks}
                    </p>
                  </div>
                  <UserIcon className="w-6 h-6 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm">Group Progress</p>
                    <p className="text-2xl font-bold text-white">
                      {groupAnalytics.groupTaskAnalytics.groupTaskProgress}%
                    </p>
                  </div>
                  <CheckCircleIcon className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Task Headers Progress */}
            {groupAnalytics.groupTaskAnalytics.taskHeaders.length > 0 && (
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
                <h3 className="text-purple-400 font-medium mb-4">Task Headers Progress</h3>
                <div className="space-y-3">
                  {groupAnalytics.groupTaskAnalytics.taskHeaders.map((header, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{header.headerTitle}</h4>
                          <p className="text-gray-400 text-sm">from: {header.taskTitle}</p>
                        </div>
                        {header.assignedTo && (
                          <div className="text-xs text-blue-400 bg-blue-500/20 rounded px-2 py-1">
                            Assigned
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-600/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${header.totalSubtasks > 0 ? (header.completedSubtasks / header.totalSubtasks) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-300">
                          {header.completedSubtasks}/{header.totalSubtasks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
                <LineChart data={currentAnalytics.progressOverTime}>
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

        {/* Group Member Stats - Only show in group view */}
        {isGroupView && groupAnalytics?.memberStats && (
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 mb-6">
            <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Group Member Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupAnalytics.memberStats.map((member, index) => (
                <div
                  key={member.username}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{member.username}</h4>
                    <div className="flex items-center gap-1">
                      <FireIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 text-sm">{member.streak}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Tasks:</span>
                      <span className="text-white">{member.totalTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-green-400">{member.completedTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress:</span>
                      <span className="text-blue-400">{member.avgProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${member.avgProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Progress Details */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 mb-6">
          <h3 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
            <ListBulletIcon className="w-5 h-5" />
            {isGroupView ? "All Group Tasks Progress" : "Individual Task Progress"}
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {currentAnalytics.tasks.map((task) => (
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
