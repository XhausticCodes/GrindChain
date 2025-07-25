// src/pages/Login.jsx
// import DotGrid from "../../public/DotGrid.jsx";
import Particles from "../../public/Particles";
import CurvedLoop from "../../public/CurvedLoop.jsx";
import LoginContent from "../components/LoginContent.jsx";
import LoginShowcase from "../components/LoginShowcase.jsx";
import Footer from "../components/Footer.jsx";

const LoginPage = () => {
  return (
    <div className="relative flex flex-col min-h-screen w-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg)]"></div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      {/* Particles and DotGrid overlay */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* <DotGrid
          dotSize={5}
          gap={25}
          baseColor="#5C3B24"
          activeColor="#D2B48C"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        /> */}
        <Particles
          particleColors={["#ffc40c", "#ffc40c"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      {/* Header with CurvedLoop */}
      <header className="relative z-10 w-full h-[20vh] flex items-center justify-center">
        <div className="w-[50vw] mx-auto flex items-center justify-center -mt-35">
          <CurvedLoop marqueeText="Welcome to GrindHub✦" />
        </div>
      </header>
      {/* Main content below header */}
      <main className="relative z-10 flex flex-1 flex-col md:flex-row items-center justify-center w-full h-full py-8 md:py-0">
        <div className="flex-1 flex items-center justify-center w-full h-full mb-8 md:mb-0">
          <LoginShowcase />
        </div>
        <div className="flex-1 flex items-center justify-center w-full h-full">
          <LoginContent />
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
