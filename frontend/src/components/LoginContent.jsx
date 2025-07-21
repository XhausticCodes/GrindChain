import React from "react";
import LoginForm from "./LoginForm.jsx";

const LoginContent = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md p-8 mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-10">
      <div className="h-25 w-25 "><img src="src/assets/Sorting_Hat.webp" alt="" /></div>
      <h1 className="mb-2 text-3xl font-bold text-white text-center">
        Welcome Back
      </h1>
      <p className="mb-6 text-lg text-white/80 text-center">
        Sign in to continue to GrindChain
      </p>
      <LoginForm />
    </div>
  );
};

export default LoginContent;