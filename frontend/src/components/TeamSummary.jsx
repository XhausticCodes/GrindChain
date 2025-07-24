import React from "react";

const team = [
  { name: "Alice", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Bob", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Carol", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Dan", img: "https://randomuser.me/api/portraits/men/76.jpg" },
];

const TeamSummary = () => (
  <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-600/20 rounded-lg p-3 shadow-lg w-full h-full flex items-center justify-between gap-3">
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {team.slice(0, 3).map((member, idx) => (
          <img
            key={idx}
            src={member.img}
            alt={member.name}
            className="w-6 h-6 rounded-full border-2 border-slate-800 object-cover shadow-sm"
            style={{ zIndex: 10 - idx }}
          />
        ))}
        <span
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold border-2 border-slate-800 shadow-sm"
          style={{ zIndex: 6 }}
        >
          +9
        </span>
      </div>
    </div>
    <div className="text-slate-300 text-xs font-medium">🏠 Team: 42H/week</div>
  </div>
);

export default TeamSummary;
