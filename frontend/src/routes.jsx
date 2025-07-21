import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const AppRoutes = () => (
  <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
