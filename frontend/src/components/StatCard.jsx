import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const StatCard = ({ title, value, total, percent, color }) => {
  return (
    <div className="blur-theme bg-[#18192a] w-[200px] h-[220px] rounded-2xl flex flex-col items-center justify-center shadow p-6">
      <div className="w-20 h-20 mb-4">
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          strokeWidth={8}
          styles={buildStyles({
            pathColor: color,
            textColor: "#fff",
            trailColor: "#23243a",
            textSize: "20px",
          })}
        />
      </div>
      <div className="text-md text-center font-bold text-white mb-1">
        {title}
      </div>
      <div className="text-2xl font-extrabold text-white">
        {value}/{total}
      </div>
      <div className="text-sm text-[#94a3b8]">Projects</div>
    </div>
  );
};

export default StatCard;
