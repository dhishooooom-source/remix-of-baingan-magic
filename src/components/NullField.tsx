import { useEffect, useRef } from "react";

const NullField = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!containerRef.current) return;

        const initParticles = () => {
            if (!containerRef.current) return;

            const tokens = ["NO WORK LABS", "NWL", "∅", "null", "→", "WHERE TO FLY"];
            const particleCount = 200;
            const lineCount = 30; // More lines as requested

            // Clear container
            while (containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
            }

            const particles: any[] = [];
            const lines: HTMLDivElement[] = [];

            // Create lines and particles
            for (let i = 0; i < lineCount; i++) {
                const line = document.createElement("div");
                line.className = "absolute whitespace-nowrap pointer-events-none select-none flex gap-8 items-center";

                // Random drift properties for the line
                const driftSpeed = 1.0 + Math.random() * 1.5;
                const yPos = (i / lineCount) * 100 + (Math.random() * 5 - 2.5); // Distributed vertically

                line.style.top = `${yPos}vh`;
                line.style.left = `0`; // Start at 0 left
                line.style.width = '100vw'; // Full width container helper
                line.style.justifyContent = 'center'; // Center content initially if we used flex, but we are drifting logic
                line.style.opacity = `${0.3 + Math.random() * 0.4}`;

                // Populate line with tokens
                const tokenCount = 15 + Math.floor(Math.random() * 10);

                for (let j = 0; j < tokenCount; j++) {
                    const token = document.createElement("span");
                    token.textContent = tokens[Math.floor(Math.random() * tokens.length)];
                    token.className = "null-particle inline-block text-[20px] tracking-[0.12em] font-mono transition-transform will-change-transform";
                    token.style.color = "rgba(200, 230, 255, 0.15)";

                    line.appendChild(token);

                    particles.push({
                        element: token,
                        lineElement: line,
                        rx: 0,
                        ry: 0,
                        vx: 0,
                        vy: 0,
                        strength: Math.random() * 0.6 + 0.2,
                    });
                }

                containerRef.current.appendChild(line);

                // Rhythmic properties
                const direction = i % 2 === 0 ? 1 : -1;
                const speed = 1.5 + Math.sin(i * 0.8) * 0.5;

                (line as any)._driftOffset = (Math.random() - 0.5) * window.innerWidth;
                (line as any)._driftSpeed = speed;
                (line as any)._direction = direction;
                lines.push(line);
            }

            // OPTIMIZATION: Cache initial positions
            particles.forEach(p => {
                p.cachedTokenLeft = p.element.offsetLeft;
                p.cachedTokenTop = p.element.offsetTop;
                p.cachedLineTop = p.lineElement.offsetTop;
            });

            let mouseX = -9999;
            let mouseY = -9999;

            // Defer gravity listener
            const handleMouseMove = (e: MouseEvent) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };

            const startGravity = () => {
                window.removeEventListener('pointermove', startGravity);
                window.removeEventListener('click', startGravity);
                window.addEventListener("mousemove", handleMouseMove);
            };

            window.addEventListener('pointermove', startGravity);
            window.addEventListener('click', startGravity);

            // Cleanup function for the listener
            (window as any)._gravityCleanup = () => {
                window.removeEventListener('pointermove', startGravity);
                window.removeEventListener('click', startGravity);
                window.removeEventListener("mousemove", handleMouseMove);
            };

            const animate = () => {
                // 1. Move lines (Drift)
                lines.forEach((line: any) => {
                    line._driftOffset += line._driftSpeed * line._direction;

                    if (line._direction === 1 && line._driftOffset > window.innerWidth) {
                        line._driftOffset = -window.innerWidth * 0.5;
                    } else if (line._direction === -1 && line._driftOffset < -window.innerWidth * 0.5) {
                        line._driftOffset = window.innerWidth;
                    }

                    line.style.transform = `translateX(${line._driftOffset}px)`;
                });

                // 2. Physics on particles
                particles.forEach(p => {
                    const lineOffset = (p.lineElement as any)._driftOffset;
                    const baseX = lineOffset + p.cachedTokenLeft;
                    const baseY = p.cachedTokenTop + p.cachedLineTop;

                    const currentX = baseX + p.rx;
                    const currentY = baseY + p.ry;

                    const dx = mouseX - currentX;
                    const dy = mouseY - currentY;
                    const dist = Math.sqrt(dx * dx + dy * dy); // Simple distance check, no heavy calculation

                    const INFLUENCE_RADIUS = 120;

                    if (dist < INFLUENCE_RADIUS) {
                        const force = (1 - dist / INFLUENCE_RADIUS) * p.strength;
                        p.vx += dx * force * 0.035;
                        p.vy += dy * force * 0.035;
                    }

                    p.vx += (-p.rx) * 0.02;
                    p.vy += (-p.ry) * 0.02;

                    p.vx *= 0.92;
                    p.vy *= 0.92;

                    p.rx += p.vx;
                    p.ry += p.vy;

                    const isSignificant = Math.abs(p.rx) > 0.1 || Math.abs(p.ry) > 0.1;
                    const wasSignificant = (p as any)._wasSignificant || false;

                    if (isSignificant) {
                        p.element.style.transform = `translate3d(${p.rx.toFixed(2)}px, ${p.ry.toFixed(2)}px, 0)`;
                        (p as any)._wasSignificant = true;
                    } else if (wasSignificant) {
                        p.element.style.transform = '';
                        (p as any)._wasSignificant = false;
                    }
                });

                animationRef.current = requestAnimationFrame(animate);
            };

            animationRef.current = requestAnimationFrame(animate);
        };

        // Phase 4: Defer non-essential JS
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => initParticles());
        } else {
            setTimeout(initParticles, 100);
        }

        return () => {
            if ((window as any)._gravityCleanup) (window as any)._gravityCleanup();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="null-field"
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
            style={{ background: '#0E0E0E' }}
        />
    );
};

export default NullField;
