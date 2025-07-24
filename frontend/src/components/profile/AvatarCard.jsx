import React from "react";

const AvatarCard = ({ avatar, username }) => (
  <div className="flex-1 flex items-end justify-center p-6 md:p-12">
    <div className="relative w-40 h-40 md:w-64 md:h-64 flex items-center justify-center">
      {/* Magical shadow: black + yellow blurred layers */}
      <div className="absolute inset-0 rounded-3xl bg-black opacity-90 blur-2xl z-0" />
      <div className="absolute inset-0 rounded-3xl bg-yellow-400 opacity-40 blur-3xl z-0" />
      <div className="relative w-full h-full rounded-3xl overflow-hidden border-1 border-yellow-500 shadow-2xl bg-slate-800 flex items-center justify-center z-10">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover "
          />
        ) : (
          <span className="text-[6rem] md:text-[8rem] text-yellow-400 bg-slate-700 w-full h-full flex items-center justify-center">
            🧙‍♂️
          </span>
        )}
      </div>
    </div>
  </div>
);

export default AvatarCard;
