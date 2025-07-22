import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Chatroom from "./pages/Chatroom";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

const AppRoutes = () => (
  <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<LoginPage />} />
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const Dashboard = lazy(() => import("./pages/Dashboard"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !authenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
export default AppRoutes;
