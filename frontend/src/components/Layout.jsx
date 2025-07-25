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
      {/* Background */}
      {/* Castle Image:  */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg)] overflow-hidden"></div>

      {/* Library:  */}
      {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/Starry-Night.jpeg)] overflow-hidden"></div> */}

      {/* Yelloish/browish midnight  */}
      {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/ardeco.jpeg)] overflow-hidden"></div> */}

      {/* rnb type clouds (Blue and purple)  */}
      {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/2222.jpeg)] overflow-hidden"></div> */}

      <div className="absolute inset-0 bg-black/40 z-0 overflow-hidden" />
      <div className="absolute inset-0 z-0 overflow-hidden blur-theme3">
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
          <TopBar user={user} onLogout={logout} />
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;


// import Sidebar from "./Sidebar";
// import Pricing from "./Pricing";
// import TopBar from "./TopBar";
// import { Outlet } from "react-router-dom";
// import Galaxy from "../../public/Galaxy";
// import { useAuth } from "../contexts/AuthContext";
// import Particles from "../../public/Particles";
// import Iridescence from "../../public/Iridescence";
// import Aurora from "../../public/Aurora";

// const Layout = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="relative h-screen w-full overflow-hidden">
//       {/* Background */}
//       {/* Castle Image (default): */}
//       <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg)] overflow-hidden"></div>
//       {/* Library:  */}
//       {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/Starry-Night.jpeg)] overflow-hidden"></div> */}
//       {/* Yellowish/brownish midnight: */}
//       {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/ardeco.jpeg)] overflow-hidden"></div> */}
//       {/* RnB type clouds (Blue and purple): */}
//       {/* <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/2222.jpeg)] overflow-hidden"></div> */}
//       <div className="absolute inset-0 bg-black/40 z-0 overflow-hidden" />
//       <div className="absolute inset-0 z-0 overflow-hidden blur-theme3">
//         {/* <Iridescence
//           color={[0.22, 0.13, 0.09]}
//           mouseReact={false}
//           amplitude={0.1}
//           speed={1.0}
//         /> */}
//         {/* <Galaxy
//           mouseRepulsion={true}
//           mouseInteraction={true}
//           density={0.5}
//           glowIntensity={0.3}
//           saturation={0.4}
//           hueShift={15}
//         /> */}
//         {/* <Aurora
//           colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
//           blend={0.5}
//           amplitude={1.0}
//           speed={0.5}
//         /> */}
//         <Particles
//           particleColors={["#ffc40c", "#9333ea"]}
//           particleCount={50}
//           particleSpread={15}
//           speed={0.05}
//           particleBaseSize={80}
//           moveParticlesOnHover={false}
//           alphaParticles={true}
//           disableRotation={true}
//         />
//       </div>
//       {/* Main Layout */}
//       <div className="relative z-10 h-full flex">
//         <Sidebar />
//         <div className="flex-1 flex flex-col min-h-0 min-w-0">
//           <TopBar user={user} onLogout={logout} />
//           <main className="flex-1 min-h-0 overflow-hidden">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;