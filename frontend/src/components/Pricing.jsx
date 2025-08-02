import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/upgrade");
  };

  return (
    <div className="blur-theme2 bg-[#1e1e2f] rounded-tr-3xl p-4 shadow-md w-full h-full flex flex-col items-center justify-center">
      <div className="text-white font-bold text-lg mb-2">Upgrade Your Grind</div>
      <div className="text-[#94a3b8] text-sm mb-4">
        Get more features with Pro!
      </div>
      <button
        onClick={handleUpgrade}
        className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-amber-600 hover:to-yellow-700 transition-all"
      >
        Upgrade
      </button>
    </div>
  );
};

export default Pricing;
