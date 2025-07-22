import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const StatCard = ({ title, value, total, percent, color }) => {
  return (
    <div className="blur-theme w-[180px] h-[180px] rounded-[12px] flex flex-col items-center justify-center shadow-md p-2">

    <div className="bg-[#1e1e2f] w-[180px] h-[180px] rounded-[12px] flex flex-col items-center justify-center shadow-md p-2">

      <div className="w-15 h-15 mb-4">
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          strokeWidth={6}
          styles={buildStyles({
            pathColor: color,
            textColor: "#fff",
            trailColor: "#334155",
            textSize: "18px",
          })}
        />
      </div>

      <div className="text-md text-center font-bold text-white mb-1">
        {title}
      </div>

      <div className="text-md text-center font-bold text-white mb-1">{title}</div>

      <div className="text-2xl font-extrabold text-white">
        {value}/{total}
      </div>
      <div className="text-sm text-[#94a3b8]">Projects</div>
    </div>
  );
};

export default StatCard;
