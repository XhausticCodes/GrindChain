import React from "react";

const ToastNotification = ({ show, message }) => (
  <div
    className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold">
      {message}
    </div>
  </div>
);

export default ToastNotification;
