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
      {/* Core cursor dot */}
      <div
        className="rounded-full"
        style={{
          width: "8px",
          height: "8px",
          background: "hsl(220 10% 25%)",
        }}
      />
    </div>
  );
};

export default BlackHoleCursor;
