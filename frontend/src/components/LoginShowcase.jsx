import React from "react";
import TextType from "../../public/TextType.jsx";

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m4 0h-1V7h-1m-4 0h1v4h1m-4 0h1v4h1"
        />
      </svg>
    ),
    title: "GAMIFIED PRODUCTIVITY",
    desc: "Turn your daily grind into a rewarding game and stay motivated!",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"
        />
      </svg>
    ),
    title: "TEAM COLLABORATION",
    desc: "Work together, share progress, and celebrate wins as a team.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8"
        />
      </svg>
    ),
    title: "INSIGHTFUL ANALYTICS",
    desc: "Track your progress and unlock insights to boost your performance.",
  },
];

const LoginShowcase = () => (
  <div className="flex flex-col items-center justify-center w-full h-full px-4 py-8 md:py-0 md:px-8">
    <blockquote
      className="text-2xl md:text-3xl font-semibold text-white/90 italic mb-8 text-center max-w-xl text-yellow-500 tracking-wider"
      style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
    >
      <TextType
        text={[
          "THE SECRET OF YOUR FUTURE IS HIDDEN IN YOUR DAILY ROUTINE.",
          "SMALL DAILY IMPROVEMENTS OVER TIME LEAD TO STUNNING RESULTS.",
          "SUCCESS IS THE SUM OF SMALL EFFORTS, REPEATED DAY IN AND DAY OUT.",
          "SUCCESS DOESN’T COME FROM WHAT YOU DO OCCASIONALLY, IT COMES FROM WHAT YOU DO CONSISTENTLY.",
          "DISCIPLINE IS CHOOSING BETWEEN WHAT YOU WANT NOW AND WHAT YOU WANT MOST.",
        ]}
        typingSpeed={80}
        textColors={["#ffc40c", "#ffc40c", "#ffc40c", "#ffc40c", "#ffc40c"]}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="_"
      />
    </blockquote>
    <div className="grid gap-6 md:gap-8 w-full max-w-xl">
      {features.map((f, i) => (
        <div
          key={i}
          className="flex items-start gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 shadow-md"
        >
          <div>{f.icon}</div>
          <div>
            <div
              className="text-lg font-bold text-white mb-1  text-yellow-500 tracking-wider"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              {f.title}
            </div>
            <div className="text-white/80 text-sm">{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoginShowcase;
