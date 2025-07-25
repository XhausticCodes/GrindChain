// import DotGrid from "../../public/DotGrid.jsx";
import Particles from "../../public/Particles";
import CurvedLoop from "../../public/CurvedLoop.jsx";
import SignupContent from "../components/SignupContent.jsx";
import LoginShowcase from "../components/LoginShowcase.jsx";
import Footer from "../components/Footer.jsx";

const SignupPage = () => {
  return (
    <div
      className="relative flex flex-col min-h-screen w-screen overflow-hidden"
      style={{ height: "100vh", minHeight: "100vh", maxHeight: "100vh" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-[url(/src/assets/05ebf61ff7cb0591b96a8e06bdb5de1e.jpg)]"></div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      {/* Particles and DotGrid overlay */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* <DotGrid ... /> */}
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
          <CurvedLoop marqueeText="Join GrindHub ✦" />
        </div>
      </header>
      {/* Main content below header */}
      <main className="relative z-10 flex flex-1 min-h-0 flex-col md:flex-row items-center justify-center w-full py-4 md:py-0 gap-2">
        <div className="flex-1 flex items-center justify-center w-full h-full">
          <LoginShowcase />
        </div>
        <div className="flex-1 flex items-center justify-center w-full h-full">
          <SignupContent />
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignupPage;
