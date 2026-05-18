import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface Props {
  theme?: "none" | "blue" | "orange"
}

export default function ServiceBackground({ theme = "none" }: Props) {
  const [init, setInit] = useState(false);

  // Initialize the particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Theme-based colors
  const particleColor = theme === "blue" ? "#2563eb" : theme === "green" ? "#22c55e" : "#9ca3af";
  const splashColors = {
    blue: ["#eff6ff", "#3b82f6", "#60a5fa"],
    green: ["#f0fdf4", "#22c55e", "#16a34a"],
    none: ["#f3f4f6", "#d1d5db", "#9ca3af"]
  };

  const currentSplashes = theme === "blue" ? splashColors.blue : theme === "green" ? splashColors.green : splashColors.none;

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          push: { quantity: 4 },
          grab: { distance: 140, links: { opacity: 0.5 } },
        },
      },
      particles: {
        color: { value: particleColor },
        links: {
          color: particleColor,
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          random: false,
          speed: 1.2,
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: 150,
        },
        opacity: { value: 0.6 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    [particleColor] // Re-render when particle color changes
  );

  if (init) {
    return (
      <div className="fixed inset-0 z-0 bg-white overflow-hidden transition-colors duration-1000">
        {/* Animated Splash Blobs with Dynamic Colors */}
        <div className="absolute inset-0 overflow-hidden opacity-20 transition-opacity duration-1000">
          <div className="splash-blob splash-1" style={{ background: `radial-gradient(circle, ${currentSplashes[0]} 0%, ${currentSplashes[1]} 100%)` }}></div>
          <div className="splash-blob splash-2" style={{ background: `radial-gradient(circle, ${currentSplashes[0]} 0%, ${currentSplashes[2]} 100%)` }}></div>
          <div className="splash-blob splash-3" style={{ background: `radial-gradient(circle, ${currentSplashes[0]} 0%, ${currentSplashes[1]} 100%)` }}></div>
        </div>

        <Particles
          id="tsparticles"
          options={options as any}
          className="w-full h-full relative z-10 transition-all duration-1000"
        />

        <style>{`
          .splash-blob {
            position: absolute;
            filter: blur(100px);
            border-radius: 50%;
            animation: splash-float 25s infinite alternate ease-in-out;
            z-index: 1;
            transition: background 1s ease-in-out;
          }
          .splash-1 { width: 600px; height: 600px; top: -10%; left: -10%; animation-duration: 30s; }
          .splash-2 { width: 500px; height: 500px; bottom: 10%; right: -5%; animation-duration: 35s; animation-delay: -5s; }
          .splash-3 { width: 450px; height: 450px; top: 40%; left: 30%; animation-duration: 28s; animation-delay: -12s; }
          @keyframes splash-float {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            50% { transform: translate(150px, 100px) scale(1.3) rotate(180deg); }
            100% { transform: translate(-100px, 200px) scale(0.9) rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <div className="fixed inset-0 z-0 bg-white" />;
}
