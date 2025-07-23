import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const tasks = [
  { title: "Design new landing page", date: "2024-06-10 10:00 AM" },
  { title: "Team sync meeting", date: "2024-06-11 02:00 PM" },
  { title: "Review analytics report", date: "2024-06-12 04:30 PM" },
];

const UpcomingTasks = () => (
  <div className="blur-theme bg-[#1e1e2f] rounded-2xl p-6 shadow-md w-full">
    <h3 className="text-lg font-bold text-white mb-4">Upcoming Tasks</h3>
    <ul className="space-y-3">
      {tasks.map((task, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 bg-[#23243a] rounded-xl p-3"
        >
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          <div>
            <div className="text-white font-semibold">{task.title}</div>
            <div className="text-xs text-[#94a3b8]">{task.date}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingTasks;
