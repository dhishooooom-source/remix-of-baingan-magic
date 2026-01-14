import { useEffect, useState, useRef } from "react";

const BlackHoleCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const requestRef = useRef<number>();
  const targetPosition = useRef({ x: -100, y: -100 });
  const currentPosition = useRef({ x: -100, y: -100 });

  // Smooth lerp for the cursor movement
  useEffect(() => {
    const animate = () => {
      const dx = targetPosition.current.x - currentPosition.current.x;
      const dy = targetPosition.current.y - currentPosition.current.y;

      currentPosition.current.x += dx * 0.15;
      currentPosition.current.y += dy * 0.15;

      setPosition({ x: currentPosition.current.x, y: currentPosition.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer');

      setHovering(!!isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate stable particle configs
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: `${i * 30}deg`,
    delay: `${-(i * 0.1)}s`,
    radius: '30px',
  }));

  return (
    <div
      className="pointer-events-none fixed z-[9999] mix-blend-exclusion"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Event Horizon (Core) */}
      <div
        className={`relative rounded-full bg-white transition-all duration-300 ease-out flex items-center justify-center ${hovering ? "w-16 h-16 opacity-90" : "w-6 h-6 opacity-100"
          }`}
        style={{
          boxShadow: hovering
            ? "0 0 30px 5px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(0,0,0,0.8)"
            : "0 0 10px 2px rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* Accretion Disk (Particles) */}
        {!hovering && particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-implode"
            style={{
              // @ts-ignore
              "--angle": p.angle,
              "--radius": p.radius,
              animationDelay: p.delay,
            }}
          />
        ))}

        {/* Hover specific distortion ring */}
        {hovering && (
          <div className="absolute inset-0 border border-white/30 rounded-full animate-ping opacity-20" />
        )}
      </div>
    </div>
  );
};

export default BlackHoleCursor;
