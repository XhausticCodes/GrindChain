import React from "react";

const AboutSection = ({ username, description }) => (
  <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-12">
    <h2
      className="text-6xl font-bold text-yellow-400 mb-2 tracking-wider text-center"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      {username}
    </h2>
    <div
      className="text-2xl font-bold text-yellow-400 mb-2 tracking-wider text-center"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      About
    </div>
    <div className="blur-theme px-3 py-2 text-white/80 text-base min-h-[48px] text-center rounded-xl ">
      {description || (
        <span className="italic text-white/40">No description set.</span>
      )}
    </div>
  </div>
);

export default AboutSection;
