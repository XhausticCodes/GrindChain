import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Default data for when no user data is available
const defaultData = [
  { month: "Jul 20", task0: 5, task1: 12, task2: 8, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
  { month: "Jul 21", task0: 8, task1: 15, task2: 12, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
  { month: "Jul 22", task0: 12, task1: 25, task2: 18, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
  { month: "Jul 23", task0: 15, task1: 35, task2: 22, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
  { month: "Jul 24", task0: 72, task1: 85, task2: 65, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
  { month: "Jul 25", task0: 8, task1: 18, task2: 12, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
  { month: "Jul 26", task0: 5, task1: 12, task2: 8, taskName0: "Task A", taskName1: "Task B", taskName2: "Task C" },
];

// Colors for different task lines
const taskColors = [
  "#3b82f6", // Blue
  "#10b981", // Green  
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-purple-500/30 p-3 rounded-lg shadow-xl text-white">
        <div className="font-bold text-yellow-400 mb-2">{label}</div>
        {payload.map((entry, index) => {
          const taskName = entry.payload[`taskName${entry.dataKey.replace('task', '')}`] || entry.dataKey;
          return (
            <div key={index} className="text-slate-300 mb-1">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {taskName}: {entry.value}% progress
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const ProgressChart = ({ data, loading = false }) => {

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl h-full">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">📊 Individual Task Progress</h3>
        <div className="animate-pulse">
          <div className="h-3 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-40 bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Use user data if available, otherwise use default data
  const chartData = data && data.length > 0 ? data : defaultData;
  
  // Find all task keys (task0, task1, task2, etc.) in the data
  const taskKeys = [];
  if (chartData.length > 0) {
    Object.keys(chartData[0]).forEach(key => {
      if (key.startsWith('task') && !key.startsWith('taskName')) {
        taskKeys.push(key);
      }
    });
  }

  // Debug log the chart data
  console.log("📊 Chart Data:", chartData);
  console.log("📊 Task Keys:", taskKeys);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl h-full flex flex-col">
      {/* Magical background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          📊 Individual Task Progress
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis 
                dataKey={data && data.length > 0 ? "date" : "month"} 
                stroke="#94a3b8" 
                fontSize={11}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11}
                domain={[0, 100]} 
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Render a line for each task */}
              {taskKeys.map((taskKey, index) => (
                <Line
                  key={taskKey}
                  type="monotone"
                  dataKey={taskKey}
                  stroke={taskColors[index % taskColors.length]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: taskColors[index % taskColors.length], stroke: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: taskColors[index % taskColors.length], stroke: "#ffffff", strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;