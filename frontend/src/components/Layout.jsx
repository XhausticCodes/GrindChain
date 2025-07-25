import Sidebar from "./Sidebar";
import Pricing from "./Pricing";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Particles from "../../public/Particles";
import React, { useState } from "react";

const THEME_IMAGES = {
  castle: "/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg",
  aurora: "/src/assets/2222.jpeg",
  cloudy: "/src/assets/Starry-Night.jpeg",
};

const Layout = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("castle");

  return (
    <div className={`relative h-screen w-full overflow-hidden theme-${theme}`}>
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${THEME_IMAGES[theme]})` }}
      ></div>
      {/* Overlay for darkness and blur */}
      <div className="absolute inset-0 bg-black/40 z-0 overflow-hidden" />
      <div className="absolute inset-0 z-0 overflow-hidden blur-theme3">
        <Particles
          particleColors={["#ffc40c", "#ffc40c"]}
          particleCount={500}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-row h-full gap-6">
        <div className="flex flex-col gap-3 h-full w-[240px]">
          <div className="flex-6 basis-3/5 h-4/5">
            <Sidebar />
          </div>
          <div className="flex-4 basis-2/5 h-1/5 ">
            <Pricing />
          </div>
        </div>
        <main className="flex-1 flex flex-col min-h-0 h-full">
          <TopBar
            user={user}
            onLogout={logout}
            theme={theme}
            setTheme={setTheme}
          />
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
