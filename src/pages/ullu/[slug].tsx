import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import frontMatter from "front-matter";

interface FrontMatterAttributes {
    date: string | Date;
    author?: string;
}

interface UlluPost {
    slug: string;
    date: string;
    author: string;
    body: string;
}

export default function PravachanDetail() {
    const { slug } = useParams();
    const [pravachan, setPravachan] = useState<UlluPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPravachan = async () => {
            const modules = import.meta.glob('../../../content/ullu/*.md', { query: '?raw', import: 'default', eager: true });

            const match = Object.entries(modules).find(([path]) => path.endsWith(`/${slug}.md`));

            if (match) {
                const [_, content] = match;
                const parsed = frontMatter<FrontMatterAttributes>(content as string);
                setPravachan({
                    slug: slug || "",
                    date: new Date(parsed.attributes.date).toISOString().split('T')[0],
                    author: parsed.attributes.author || "observer",
                    body: parsed.body.trim()
                });
            }
            setLoading(false);
        };

        loadPravachan();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-mono">Loading...</div>;
    }

    if (!pravachan) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#0a0a0a",
                    color: "#f5f5f5",
                    padding: "40px",
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
            }}
        >
            <h1 style={{ opacity: 0.8, marginBottom: "20px" }}>
                Ullu Pravachan
            </h1>

            <p style={{ fontSize: "1.4rem", marginBottom: "20px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                {pravachan.body}
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
