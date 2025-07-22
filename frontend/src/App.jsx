import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "./index.css";
// import socketAPI from "./API/socketApi";

const App = () => {
  // useEffect(() => {
  //   socketAPI.on("connect", () => {
  //     console.log("✅ Connected to server:", socketAPI.id);
  //   });
  //   return () => {
  //     socketAPI.disconnect();
  //   };
  // }, []);
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
