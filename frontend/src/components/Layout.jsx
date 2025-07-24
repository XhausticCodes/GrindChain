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

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background */}
<<<<<<< HEAD
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/ardeco.jpeg)] overflow-hidden"></div>
=======
      {/* Castle Image:  */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg)] overflow-hidden"></div>

      {/* Library:  */}
      {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/Starry-Night.jpeg)] overflow-hidden"></div> */}

      {/* Yelloish/browish midnight  */}
      {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/ardeco.jpeg)] overflow-hidden"></div> */}

      {/* rnb type clouds (Blue and purple)  */}
      {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/2222.jpeg)] overflow-hidden"></div> */}

>>>>>>> 9abeb2a2179df3bd05b73b46a10436a49fa5af96
      <div className="absolute inset-0 bg-black/40 z-0 overflow-hidden" />
      
      <div className="absolute inset-0 z-0 overflow-hidden blur-theme3">
<<<<<<< HEAD
=======
        {/* <Iridescence
          color={[0.22, 0.13, 0.09]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        /> */}
        {/* <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={0.5}
          glowIntensity={0.3}
          saturation={0.4}
          hueShift={15}
        /> */}
        {/* <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        /> */}
>>>>>>> 9abeb2a2179df3bd05b73b46a10436a49fa5af96
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