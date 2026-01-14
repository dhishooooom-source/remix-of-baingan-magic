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
      {/* Warping distortion ring */}
      <div
        className="absolute rounded-full animate-spin"
        style={{
          width: "60px",
          height: "60px",
          left: "-30px",
          top: "-30px",
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            hsl(220 10% 20% / 0.15) 90deg,
            transparent 180deg,
            hsl(220 10% 20% / 0.15) 270deg,
            transparent 360deg
          )`,
          animation: "spin 3s linear infinite",
        }}
      />
      
      {/* Core cursor dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: "8px",
          height: "8px",
          left: "-4px",
          top: "-4px",
          background: "hsl(220 10% 25%)",
        }}
      />
    </div>
  );
};

export default BlackHoleCursor;
