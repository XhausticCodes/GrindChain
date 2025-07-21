import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "./index.css";

const App = () => {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
