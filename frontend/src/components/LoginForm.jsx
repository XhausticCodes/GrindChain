import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async ({ email, password }) => {
    // Placeholder for backend integration
    // Example: await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin({ email, password });
      // Handle success (redirect, show message, etc.)
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 01-8 0m8 0V8a4 4 0 10-8 0v4m8 0a4 4 0 01-8 0"
            />
          </svg>
        </span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-white bg-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base"
          required
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0-1.104.896-2 2-2s2 .896 2 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2c0-1.104.896-2 2-2z"
            />
          </svg>
        </span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-white bg-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base"
          required
        />
      </div>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="w-full py-3 mt-2 font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg shadow-md hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="flex items-center justify-between mt-2 text-sm">
        <a href="#" className="text-amber-300 hover:underline">
          Forgot password?
        </a>
        <Link to="/signup" className="text-amber-300 hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
