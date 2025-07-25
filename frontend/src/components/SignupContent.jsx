import React from "react";
import SignupForm from "./SignupForm.jsx";

const SignupContent = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full max-w-md px-4 py-3 mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-10"
      style={{ maxHeight: "90vh" }}
    >
      <div className="h-25 w-25 ">
        <img src="src/assets/Sorting_Hat.webp" alt="" />
      </div>
      <h1
        className="mb-2 text-3xl font-bold text-white text-center tracking-wider text-yellow-500"
        style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
      >
        CREATE YOUR ACCOUNT
      </h1>
      <p className="mb-4 text-lg text-white/80 text-center">
        Join GrindHub & Boost your Productivity!
      </p>
      <SignupForm />
    </div>
  );
};

export default SignupContent;
