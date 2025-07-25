import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Default data for when no user data is available
const defaultData = [
  { month: "Jan", tasks: 30 },
  { month: "Feb", tasks: 45 },
  { month: "Mar", tasks: 50 },
  { month: "Apr", tasks: 60 },
  { month: "May", tasks: 65 },
  { month: "Jun", tasks: 70 },
  { month: "Jul", tasks: 60 },
  { month: "Aug", tasks: 75 },
  { month: "Sep", tasks: 55 },
  { month: "Oct", tasks: 65 },
  { month: "Nov", tasks: 80 },
  { month: "Dec", tasks: 90 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-purple-500/30 p-3 rounded-lg shadow-xl text-white">
        <div className="font-bold text-yellow-400">{label}</div>
        <div className="text-slate-300">{payload[0].value} {payload[0].dataKey === 'tasks' ? 'tasks' : '% progress'}</div>
      </div>
    );
  }
  return null;
};

const ProgressChart = ({ data, loading = false }) => {

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl h-full">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">📊 Productivity Metrics</h3>
        <div className="animate-pulse">
          <div className="h-3 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-40 bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Use user data if available, otherwise use default data
  const chartData = data && data.length > 0 ? data : defaultData;
  const dataKey = data && data.length > 0 ? "avgProgress" : "tasks";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 shadow-xl h-full flex flex-col">
      {/* Magical background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          📊 {data && data.length > 0 ? "Progress Trend" : "Productivity Metrics"}
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey={data && data.length > 0 ? "date" : "month"} 
                stroke="#94a3b8" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11}
                domain={[0, 100]} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;