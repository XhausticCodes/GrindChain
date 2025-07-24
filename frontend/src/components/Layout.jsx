import Sidebar from "./Sidebar";
import Pricing from "./Pricing";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import Galaxy from "../../public/Galaxy";
import { useAuth } from "../contexts/AuthContext";
import Particles from "../../public/Particles";

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/ardeco.jpeg)] overflow-hidden"></div>
      <div className="absolute inset-0 bg-black/40 z-0 overflow-hidden" />
      
      <div className="absolute inset-0 z-0 overflow-hidden blur-theme3">
        <Particles
          particleColors={["#ffc40c", "#9333ea"]}
          particleCount={50}
          particleSpread={15}
          speed={0.05}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={true}
        />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 h-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <TopBar user={user} onLogout={logout} />
          <main className="flex-1 min-h-0 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;