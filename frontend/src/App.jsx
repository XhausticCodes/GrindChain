import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "./index.css";
import socketAPI from "./API/socketApi";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { user } = useAuth();

  useEffect(() => {
    // console.log(user);
    const handleConnect = () => {
      console.log("✅ Connected to server:", socketAPI.id);
    };

    socketAPI.on("connect", handleConnect);

    return () => {};
  }, [user]);
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
