import { useState } from "react";
import Sidebar from "./Sidebar";
import Pricing from "./Pricing";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import Galaxy from "../../public/Galaxy";
import { useAuth } from "../contexts/AuthContext";
import Particles from "../../public/Particles";
import Iridescence from "../../public/Iridescence";
import Aurora from "../../public/Aurora";

const Layout = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("default");

  // Render background based on theme
  const renderBackground = () => {
    switch (theme) {
      case "galaxy":
        return (
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={0.5}
            glowIntensity={0.3}
            saturation={0.4}
            hueShift={15}
            transparent={true}
          />
        );
      case "aurora":
        return (
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        );
      case "iridescence":
        return (
          <Iridescence
            amplitude={0.1}
            speed={1.0}
            color={[1, 1, 1]}
            mouseReact={true}
          />
        );
      case "potter":
        return (
          <Particles
            particleColors={["#ffc40c", "#9333ea"]}
            particleSpread={15}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={false}
            alphaParticles={true}
            disableRotation={true}
          />
        );
      case "default":
      default:
        return (
          <Particles
            particleColors={["#ffc40c", "#9333ea"]}
            particleSpread={15}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={false}
            alphaParticles={true}
            disableRotation={true}
          />
        );
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/ardeco.jpeg)] overflow-hidden"></div>
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg)] overflow-hidden"></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0 overflow-hidden" />
      
      {/* Dynamic background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden blur-theme3">
        {renderBackground()}
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <TopBar 
            user={user} 
            onLogout={logout} 
            theme={theme} 
            setTheme={setTheme} 
          />
          <main className="flex-1 min-h-0 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;