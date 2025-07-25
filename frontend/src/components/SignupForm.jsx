import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSignup = async () => {
    // Placeholder for backend integration
    // Example: await fetch('/api/signup', { method: 'POST', body: JSON.stringify({ username, email, password }) })
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const validateForm = () => {
    const newErrors = [];
    if (username.length < 3) {
      newErrors.push("Username must be at least 3 characters long");
    }
    if (password.length < 6) {
      newErrors.push("Password must be at least 6 characters long");
    }
    if (password !== confirmPassword) {
      newErrors.push("Passwords do not match");
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      await onSignup();
      const result = await signup(username, email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setErrors(result.errors || [result.message]);
      }
    } catch {
      setErrors(["Signup failed. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col px-4 w-full gap-2" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 text-red-200 rounded-lg backdrop-blur-sm">
          <ul className="list-none">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="relative text-sm">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          {/* Simple user silhouette icon */}
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
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-white bg-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base"
          required
        />
      </div>
      <div className="relative text-sm">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          {/* Mail icon */}
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
              d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
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
      <div className="relative text-sm">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          {/* Lock icon */}
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
              d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2z"
            />
          </svg>
        </span>
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-white bg-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base"
          required
        />
      </div>
      <div className="relative text-sm">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          {/* Lock icon */}
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
              d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2z"
            />
          </svg>
        </span>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-white bg-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-base"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 mt-1 font-bold text-white text-base bg-gradient-to-r from-amber-500 to-yellow-600 rounded-md shadow-md hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all disabled:opacity-60 cursor-pointer"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>
      <div className="flex items-center justify-center  mt-2 text-sm">
        <Link to="/login" className="text-amber-300 hover:underline ">
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
