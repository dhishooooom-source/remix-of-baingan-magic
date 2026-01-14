import { useEffect, useState } from "react";

const BlackHoleCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Outer warping ring */}
      <div
        className="absolute rounded-full animate-spin"
        style={{
          width: "80px",
          height: "80px",
          left: "-40px",
          top: "-40px",
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            hsl(220 50% 15% / 0.3) 60deg,
            transparent 120deg,
            hsl(220 50% 15% / 0.2) 180deg,
            transparent 240deg,
            hsl(220 50% 15% / 0.3) 300deg,
            transparent 360deg
          )`,
          animation: "spin 4s linear infinite",
          filter: "blur(4px)",
        }}
      />
      
      {/* Middle distortion ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: "50px",
          height: "50px",
          left: "-25px",
          top: "-25px",
          background: `radial-gradient(
            circle,
            transparent 30%,
            hsl(220 60% 20% / 0.4) 50%,
            hsl(220 70% 15% / 0.6) 70%,
            transparent 100%
          )`,
          animation: "pulse 2s ease-in-out infinite",
          filter: "blur(2px)",
        }}
      />
      
      {/* Inner glow - event horizon */}
      <div
        className="absolute rounded-full"
        style={{
          width: "30px",
          height: "30px",
          left: "-15px",
          top: "-15px",
          background: `radial-gradient(
            circle,
            hsl(220 80% 8% / 0.9) 0%,
            hsl(220 70% 20% / 0.6) 40%,
            hsl(220 60% 30% / 0.3) 70%,
            transparent 100%
          )`,
          boxShadow: `
            0 0 15px hsl(220 60% 25% / 0.5),
            0 0 30px hsl(220 50% 20% / 0.3),
            inset 0 0 10px hsl(220 80% 10% / 0.8)
          `,
        }}
      />
      
      {/* Core singularity */}
      <div
        className="absolute rounded-full"
        style={{
          width: "8px",
          height: "8px",
          left: "-4px",
          top: "-4px",
          background: "hsl(220 90% 5%)",
          boxShadow: `
            0 0 8px hsl(220 70% 30% / 0.8),
            0 0 16px hsl(220 60% 25% / 0.5)
          `,
        }}
      />
    </div>
  );
};

export default BlackHoleCursor;
