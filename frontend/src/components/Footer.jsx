import React from "react";

const Footer = () => (
  <footer className="relative z-10 w-full py-2 bg-black/30 text-white/70 text-center text-xs flex flex-col md:flex-row items-center justify-center gap-1 border-t border-white/10 flex-shrink-0 space-x-5">
    <span>&copy; {new Date().getFullYear()} GrindChain</span>
    <span className="hidden md:inline">|</span>
    <a href="#" className="hover:underline">
      About
    </a>
    <a href="#" className="hover:underline">
      Contact
    </a>
    <a href="#" className="hover:underline">
      Privacy
    </a>
  </footer>
);

export default Footer;
