import React, { useState, useEffect } from "react";
import { ulluPravachans } from "../../data/ulluPravachans";
import { Link } from "react-router-dom";

export default function UlluFeed() {
    const [visibleCount, setVisibleCount] = useState(9);
    const loaderRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => prev + 6);
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, []);

    const visiblePravachans = ulluPravachans.slice(0, visibleCount);

    return (
        <div className="ullu-page">
            <h1 style={{ opacity: 0.8, marginBottom: 20, fontSize: "1.8rem" }}>Ullu Pravachan</h1>
            <p style={{ opacity: 0.4, marginBottom: 40 }}>Tiny truths from the edge of knowing.</p>

            <div className="ullu-grid">
                {visiblePravachans.map((p) => (
                    <Link
                        key={p.slug}
                        to={`/ullu/${p.slug}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "block" // Ensure link wraps the card properly
                        }}
                    >
                        <div className="ullu-card">
                            <p className="ullu-card-text">{p.content}</p>
                            <p className="ullu-card-author">— {p.author}</p>
                        </div>
                    </Link>
                ))}
            </div>
            {/* Sentinel for infinite scroll */}
            {visibleCount < ulluPravachans.length && (
                <div ref={loaderRef} style={{ height: "40px", width: "100%" }}></div>
            )}
        </div>
    );
}
