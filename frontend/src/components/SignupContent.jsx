import React from "react";
import SignupForm from "./SignupForm.jsx";

const SignupContent = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md pl-8 pr-8 pt-4 pb-8 mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-10">
      <div className="h-25 w-25 "><img src="src/assets/Sorting_Hat.webp" alt="" /></div>
      <h1 className="mb-2 text-3xl font-bold text-white text-center">
        Create Your Account
      </h1>
      <p className="mb-4 text-lg text-white/80 text-center">
        Join GrindChain & Boost your Productivity!
      </p>
      <SignupForm />
    </div>
  );
};

export default SignupContent;
