import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import GlassSurface from "../../public/GlassSurface";
import InfiniteMenu from "../../public/InfiniteMenu";
import TiltedCard from "../../public/TiltedCard";
import {
  SparklesIcon,
  ChartBarIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Galaxy from "../../public/Galaxy";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const featuresRef = useRef(null);
  const featuresContainerRef = useRef(null);

  useEffect(() => {
    const featuresContainer = featuresContainerRef.current;
    const features = featuresRef.current;

    if (!featuresContainer || !features) return;

    // Create horizontal scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: featuresContainer,
        start: "top top",
        end: "+=130%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onEnter: () => {
          document.body.classList.add("horizontal-scroll-active");
        },
        onLeave: () => {
          // Smooth transition when leaving the section
          gsap.to(features, {
            duration: 0.5,
            ease: "power2.out",
          });
          document.body.classList.remove("horizontal-scroll-active");
        },
        onEnterBack: () => {
          // Smooth transition when entering back
          gsap.to(features, {
            duration: 0.3,
            ease: "power2.out",
          });
          document.body.classList.add("horizontal-scroll-active");
        },
        onLeaveBack: () => {
          document.body.classList.remove("horizontal-scroll-active");
        },
      },
    });

    // Animate the features container to move horizontally
    tl.to(features, {
      x: "-100%",
      ease: "power2.out",
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const items = [
    {
      image: "/src/assets/sandesh.jpg",
      link: "https://www.linkedin.com/in/sandesh13fr",
      title: "SANDESH",
      description: "AI ENGINEER",
    },
    {
      image: "/src/assets/Garvit-Bhaiya.jpg",
      link: "https://www.linkedin.com/in/garvit-thakral-23a0a130a",
      title: "GARVIT",
      description: "BACKEND DEVELOPER",
    },
    {
      image: "/src/assets/kuku.jpg",
      link: "https://www.linkedin.com/in/harsh-devchill",
      title: "HARSH",
      description: "FRONTEND DEVELOPER",
    },
    {
      image: "/src/assets/sandesh.jpg",
      link: "https://x.com/sandesh13fr",
      title: "SANDESH",
      description: "AI ENGINEER",
    },
    {
      image: "/src/assets/Garvit-Bhaiya.jpg",
      link: "https://x.com/thakral_garvit",
      title: "GARVIT",
      description: "BACKEND DEVELOPER",
    },
    {
      image: "/src/assets/kuku.jpg",
      link: "https://x.com/itsbingchilling",
      title: "HARSH",
      description: "FRONTEND DEVELOPER",
    },
    // {
    //   image: "https://picsum.photos/600/600?grayscale",
    //   link: "https://google.com/",
    //   title: "Item 4",
    //   description: "This is pretty cool, right?",
    // },
  ];

  const featuresData = [
    {
      icon: SparklesIcon,
      title: "AI Task Oracle",
      description:
        "Natural language task generation with intelligent roadmaps and milestone tracking powered by advanced AI.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30",
      hoverBorder: "hover:border-purple-500/50",
    },
    {
      icon: UsersIcon,
      title: "Real-time Collaboration",
      description:
        "Live chat, group management, and instant notifications for seamless team coordination.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      hoverBorder: "hover:border-blue-500/50",
    },
    {
      icon: ChartBarIcon,
      title: "Smart Analytics",
      description:
        "Visual insights into your productivity patterns with detailed charts and progress tracking.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/30",
      hoverBorder: "hover:border-green-500/50",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Group Chat",
      description:
        "Create study groups, share progress, and motivate each other in real-time chat rooms.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-500/30",
      hoverBorder: "hover:border-orange-500/50",
    },
    {
      icon: BellIcon,
      title: "Smart Notifications",
      description:
        "Intelligent reminders and real-time updates to keep you on track with your goals.",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      borderColor: "border-indigo-500/30",
      hoverBorder: "hover:border-indigo-500/50",
    },
    {
      icon: UserIcon,
      title: "Profile Management",
      description:
        "Customize your profile, track achievements, and maintain your productivity journey.",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-500/10 to-cyan-500/10",
      borderColor: "border-teal-500/30",
      hoverBorder: "hover:border-teal-500/50",
    },
  ];

  return (
    <div className="bg-black min-h-screen hide-scrollbar-landing">
      {/* Fixed Glass Surface Navbar */}
      <nav
        className="fixed top-[1px] left-0 right-0 z-50 px-4 py-2"
        style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto">
          <GlassSurface
            width="100%"
            height={70}
            borderRadius={50}
            Opacity={0.4}
            className="flex items-center justify-between px-8"
          >
            <div className="flex h-full w-full items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent yellow-glow">
                  <a href="#">GRINDCHAIN</a>
                </h1>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-white/80 hover:text-yellow-400 px-3 py-2 rounded-md text-md font-medium transition-colors duration-200 navbar-glow"
                >
                  FEATURES
                </a>
                <a
                  href="#how-it-works"
                  className="text-white/80 hover:text-yellow-400 px-3 py-2 rounded-md text-md font-medium transition-colors duration-200 navbar-glow"
                >
                  HOW IT WORKS
                </a>
                <a
                  href="#about-us"
                  className="text-white/80 hover:text-yellow-400 px-3 py-2 rounded-md text-md font-medium transition-colors duration-200 navbar-glow"
                >
                  ABOUT US
                </a>
                <a
                  href="#our-team"
                  className="text-white/80 hover:text-yellow-400 px-3 py-2 rounded-md text-md font-medium transition-colors duration-200 navbar-glow"
                >
                  OUR TEAM
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-white/80 hover:text-yellow-400 px-3 py-2 rounded-md text-md font-medium transition-colors duration-200 navbar-glow"
                >
                  LOGIN
                </a>
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-6 py-2 rounded-lg text-md transform transition-all duration-200 yellow-glow button-glow"
                >
                  SIGNUP
                </a>
              </div>
            </div>
          </GlassSurface>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[100vh] w-full">
        <div
          // className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          // className="absolute inset-0 bg-gradient-to-b from-[]"
          // style={{
          //   backgroundImage:
          //     "url(/src/assets/61c642c66844e8b5393b72f1ee917101-Picsart-AiImageEnhancer.jpg)",
          // }}
          className="absolute inset-0 bg-gradient-to-b from-transparent from-80% to-black to-10%"
          style={{
            backgroundImage: `
    linear-gradient(to bottom, transparent, rgba(0,0,0,0.2), black),
    url('/src/assets/61c642c66844e8b5393b72f1ee917101-Picsart-AiImageEnhancer.jpg')
  `,
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1
              className="text-8xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent yellow-glow-title tracking-widest"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              GRINDCHAIN
            </h1>
            <p
              className="text-2xl md:text-3xl text-white/90 mb-10 font-light tracking-wider uppercase navbar-glow-title"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Where Magic Meets Productivity
            </p>
            <p
              className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto  text-shadow-lg/70 uppercase"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Transform your goals into reality with AI-powered task management,
              real-time collaboration, and magical productivity tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-gradient-to-r from-yellow-400/80 to-amber-500/80 text-black font-bold px-4 py-2 rounded-lg text-lg transform transition-all duration-200 hover:scale-105 yellow-glow button-glow-hero uppercase tracking-wide"
                style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
              >
                Start Your Journey
              </a>
              <a
                href="/login"
                className="border-1 border-yellow-400 text-yellow-400 font-bold px-4 py-2 rounded-lg text-lg hover:bg-amber-500/80 hover:border-yellow-700  hover:text-black transition-all duration-200 uppercase tracking-wide"
                style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Features Section */}
      <section
        id="features"
        ref={featuresContainerRef}
        className="relative h-screen w-full bg-black overflow-hidden features-section"
      >
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/90 to-transparent z-20"></div>

        {/* Section Header */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <h2
            className="text-4xl md:text-5xl pb-2 font-bold mb-2 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent yellow-glow-title"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            MAGICAL FEATURES
          </h2>
          <p
            className="text-xl text-white/70 max-w-3xl mx-auto uppercase"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Discover the powerful tools that will revolutionize your
            productivity
          </p>
        </div>

        {/* Galaxy Background */}
        <div className="galaxy-background">
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={false}
            density={1.5}
            glowIntensity={0.5}
            saturation={0.8}
            hueShift={240}
            autoCenterRepulsion={20}
          />
        </div>

        <div className="galaxy-overlay"></div>

        {/* Horizontal Scroll Container */}
        <div
          ref={featuresRef}
          className="absolute top-1/12 transform -translate-y-1/2 flex gap-30 px-8 horizontal-scroll-container left-25 z-30"
          style={{ width: "130vw" }}
        >
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} rounded-2xl p-8 hover:${feature.hoverBorder} transition-all duration-300 min-w-[400px] max-w-[400px] feature-card backdrop-blur-md `}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 feature-card-icon`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
          {/* <div className="absolute bottom-0 left-0 right-0 h-55 bg-gradient-to-t from-black via-black/80 to-transparent"></div> */}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b to-gray-900 from-black relative z-10 overflow-hidden"
      >
        <div className="galaxy-overlay"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase yellow-glow-title"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              How It Works
            </h2>
            <p
              className="text-xl text-white/70 max-w-3xl mx-auto uppercase navbar-glow-title"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Sign Up & Create
              </h3>
              <p className="text-white/70">
                Join our magical community and start creating your first
                AI-powered tasks with natural language.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Collaborate & Track
              </h3>
              <p className="text-white/70">
                Form study groups, chat with teammates, and track your progress
                with real-time analytics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Achieve & Grow
              </h3>
              <p className="text-white/70">
                Complete milestones, celebrate achievements, and watch your
                productivity soar to new heights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className=" bg-gradient-to-b from-gray-950 from-5% to-black"
      >
        <motion.div
          className="relative w-full"
          style={{
            backgroundColor: "#000000",
            backgroundImage: `
                radial-gradient(ellipse 80% 60% at 50% 0%, rgba(17, 24, 39, 0.8), transparent 90%),
                radial-gradient(circle, rgba(59, 130, 246, 0.2) 1.5px, transparent 1.5px)
              `,
            backgroundSize: "100% 100%, 30px 30px",
          }}
          animate={{
            backgroundPosition: [
              "center, 100px 0px", // 0°
              "center, 92px 38px", // 22.5°
              "center, 70px 70px", // 45°
              "center, 38px 92px", // 67.5°
              "center, 0px 100px", // 90°
              "center, -38px 92px", // 112.5°
              "center, -70px 70px", // 135°
              "center, -92px 38px", // 157.5°
              "center, -100px 0px", // 180°
              "center, -92px -38px", // 202.5°
              "center, -70px -70px", // 225°
              "center, -38px -92px", // 247.5°
              "center, 0px -100px", // 270°
              "center, 38px -92px", // 292.5°
              "center, 70px -70px", // 315°
              "center, 92px -38px", // 337.5°
              "center, 100px 0px", // back to 0°
            ],
          }}
          transition={{
            duration: 60, // make it slower for elegance
            ease: "linear", // constant speed
            repeat: Infinity,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-21">
            <div className="text-center mb-6">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase yellow-glow-title"
                style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
              >
                About Us
              </h2>
              <p
                className="text-xl text-white/70 max-w-3xl mx-auto uppercase navbar-glow-title"
                style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
              >
                We're passionate about making productivity magical and
                accessible to everyone.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="lg:pr-8">
                <h3
                  className="text-3xl font-bold text-white mb-6 uppercase tracking-wider"
                  style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
                >
                  Our Mission
                </h3>
                <p className="text-white/70 text-lg mb-6">
                  GrindChain was born from the idea that productivity should be
                  as enchanting as it is effective. We combine cutting-edge AI
                  technology with intuitive design to create a platform that not
                  only helps you achieve your goals but makes the journey
                  enjoyable.
                </p>
                <p className="text-white/70 text-lg mb-8">
                  Whether you're a student, professional, or anyone looking to
                  boost their productivity, our AI-powered task management
                  system adapts to your needs and helps you succeed.
                </p>
              </div>

              <div className="lg:pl-8 flex justify-center">
                <TiltedCard
                  imageSrc="/src/assets/dashboard.png"
                  altText="Kendrick Lamar - GNX Album Cover"
                  captionText="DashBoard"
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="650px"
                  rotateAmplitude={4}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={false}
                  overlayContent={
                    <p className="tilted-card-demo-text">
                      Kendrick Lamar - GNX
                    </p>
                  }
                />
              </div>
            </div>

            {/* Tech Stack Bar */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                <h4
                  className="text-xl font-bold text-white mb-4 text-center uppercase tracking-wider"
                  style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
                >
                  Tech Stack
                </h4>
                <div
                  className="flex flex-wrap justify-center gap-6 uppercase tracking-widest"
                  style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold shadow-lg">
                    React + Vite
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                    Node.js + Express
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                    MongoDB
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                    Socket.IO
                  </div>
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                    Google Gemini AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team Members Section */}
      <section id="our-team" className="py-20 bg-black">
        <div className="mx-auto px-6">
          <div className="text-center mb-3">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase yellow-glow-title"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Our Team
            </h2>
            <p
              className="text-xl text-white/70 max-w-3xl mx-auto uppercase navbar-glow-title"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Meet the wizards behind the magic
            </p>
          </div>

          <div style={{ height: "550px", position: "relative" }}>
            <InfiniteMenu items={items} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider"
            style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
          >
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of users who have already discovered the magic of
            AI-powered task management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-gradient-to-r from-yellow-400/80 to-amber-500/80 text-black font-bold px-4 py-2 rounded-lg text-lg transform transition-all duration-200 hover:scale-105 yellow-glow button-glow-hero uppercase tracking-wide"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Start Free Today
            </a>
            <a
              href="/login"
              className="border-1 border-yellow-400 text-yellow-400 font-bold px-4 py-2 rounded-lg text-lg hover:bg-amber-500/80 hover:border-yellow-700  hover:text-black transition-all duration-200 uppercase tracking-wide"
              style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-800">
        <div
          className="max-w-7xl mx-auto px-6 text-center uppercase tracking-wider"
          style={{ fontFamily: "Harry-Potter, Inter, sans-serif" }}
        >
          <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
            GRINDCHAIN
          </h3>
          <p className="text-yellow-500/80 mb-6">
            Where Magic Meets Productivity
          </p>
          <div className="flex justify-center space-x-6 text-white/80">
            <a
              href="#features"
              className="hover:text-yellow-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-yellow-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#about-us"
              className="hover:text-yellow-400 transition-colors"
            >
              About
            </a>
            <a
              href="/login"
              className="hover:text-yellow-400 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
