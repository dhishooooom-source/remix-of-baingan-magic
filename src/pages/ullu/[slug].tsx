import React from "react";
import { useParams, Link } from "react-router-dom";
import { ulluPravachans } from "../../data/ulluPravachans";

export default function PravachanDetail() {
    const { slug } = useParams();
    const pravachan = ulluPravachans.find((p) => p.slug === slug);

    if (!pravachan) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#0a0a0a",
                    color: "#f5f5f5",
                    padding: "40px",
                    fontFamily: "Inter, sans-serif"
                }}
            >
                <h1 style={{ opacity: 0.8, marginBottom: "20px" }}>
                    Pravachan Not Found
                </h1>
                <p style={{ opacity: 0.5, marginBottom: "20px" }}>
                    This wisdom has slipped into the void.
                </p>
                <Link to="/ullu" style={{ color: "#888" }}>← Return to Pravachans</Link>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0a0a0a",
                color: "#f5f5f5",
                padding: "40px",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <h1 style={{ opacity: 0.8, marginBottom: "20px" }}>
                Ullu Pravachan
            </h1>

            <p style={{ fontSize: "1.4rem", marginBottom: "20px", lineHeight: "1.6" }}>
                “{pravachan.content}”
            </p>

            <p style={{ opacity: 0.4, marginBottom: "40px" }}>
                — {pravachan.author}
            </p>

            <Link to="/ullu" style={{ color: "#888" }}>
                ← Back to all pravachans
            </Link>
        </div>
    );
}
