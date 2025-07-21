import React from "react";

const team = [
  { name: "Alice", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Bob", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Carol", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Dan", img: "https://randomuser.me/api/portraits/men/76.jpg" },
];

const TeamSummary = () => (
  <div className="bg-[#1e1e2f] p-6 flex flex-col justify-between shadow-md rounded-tl-3xl">
    <div className="flex items-center mb-2">
      <div className="flex -space-x-4">
        {team.map((member, idx) => (
          <img
            key={idx} 
            src={member.img}
            alt={member.name}
            className="w-10 h-10 rounded-full border-2 border-[#1e1e2f] object-cover"
            style={{ zIndex: 10 - idx }}
          />
        ))}
        <span
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9333ea] text-white text-sm font-bold border-2 border-[#1e1e2f]"
          style={{ zIndex: 6 }}
        >
          +12
        </span>
      </div>
    </div>
    <div className="text-white text-lg font-semibold">52H in a week</div>
  </div>
);

export default TeamSummary;
