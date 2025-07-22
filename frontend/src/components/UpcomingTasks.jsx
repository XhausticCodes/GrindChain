import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const tasks = [
  { title: "Design new landing page", date: "2024-06-10 10:00 AM" },
  { title: "Team sync meeting", date: "2024-06-11 02:00 PM" },
  { title: "Review analytics report", date: "2024-06-12 04:30 PM" },
];

const UpcomingTasks = () => (
  <div className="blur-theme rounded-[12px] p-6 shadow-md">
    <h3 className="text-lg font-bold text-white mb-4">Upcoming Tasks</h3>
    <ul className="space-y-3">
      {tasks.map((task, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 bg-[#23233a] rounded-[10px] px-4 py-3"
        >
          <span className="bg-[#3b82f6] p-2 rounded-full">
            <CalendarDaysIcon className="w-5 h-5 text-white" />
          </span>
          <div>
            <div className="text-white font-medium">{task.title}</div>
            <div className="text-[#94a3b8] text-xs">{task.date}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingTasks;
