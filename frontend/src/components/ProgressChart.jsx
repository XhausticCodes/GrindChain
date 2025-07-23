import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
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
      <div className="bg-[#1e1e2f] p-3 rounded-lg shadow text-[#f8fafc]">
        <div className="font-bold">{label}</div>
        <div>{payload[0].value} tasks</div>
      </div>
    );
  }
  return null;
};

const ProgressChart = () => (
  <div className="blur-theme bg-[#1e1e2f] rounded-[12px] p-6 shadow-md">
    <h3 className="text-lg font-bold text-white mb-4">Productivity Metrics</h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="tasks"
          stroke="#9333ea"
          strokeWidth={3}
          dot={{ r: 5, fill: "#9333ea" }}
          activeDot={{ r: 8, fill: "#9333ea" }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ProgressChart;
