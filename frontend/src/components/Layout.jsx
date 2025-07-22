import Sidebar from "./Sidebar";
import Pricing from "./Pricing";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import Iridescence from "../../public/Iridescence";
import Galaxy from "../../public/Galaxy";
import Aurora from "../../public/Aurora";

const Layout = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence
          color={[0.22, 0.13, 0.09]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
        {/* <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1}
          // glowIntensity={0.5}
          // saturation={0.4}
          hueShift={15}
        /> */}
        {/* <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        /> */}
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-row min-h-screen gap-6">
        <div className="flex flex-col gap-3 h-screen w-[240px]">
          <div className="flex-6 basis-3/5 h-3/5">
            <Sidebar />
          </div>
          <div className="flex-4 basis-2/5 h-2/5">
            <Pricing />
          </div>
        </div>
        <main className="flex-1 flex flex-col space-y-6 min-h-screen">
          <TopBar />
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
