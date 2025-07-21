import React from "react";
import { useEffect } from "react";
import socketAPI from "./API/socketApi";

const App = () => {
  useEffect(() => {
    socketAPI.on("connect", () => {
      console.log("✅ Connected to server:", socketAPI.id);
    });

    return () => {
      socketAPI.disconnect(); // clean up on unmount
    };
  }, []);
  return <h1>hi</h1>;
};

export default App;
