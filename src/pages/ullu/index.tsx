import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import frontMatter from "front-matter";

interface UlluPost {
    slug: string;
    date: string;
    author: string;
    body: string;
}

interface FrontMatterAttributes {
    date: string | Date;
    author?: string;
}

export default function UlluFeed() {
    const [posts, setPosts] = useState<UlluPost[]>([]);
    const [visibleCount, setVisibleCount] = useState(9);
    const loaderRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load markdown files using Vite's import.meta.glob
        const loadPosts = async () => {
            // Glob imports must be static literals
            const modules = import.meta.glob('../../../content/ullu/*.md', { query: '?raw', import: 'default', eager: true });

            const loadedPosts: UlluPost[] = Object.entries(modules).map(([path, mod]) => {
                // Handle different Vite import modes (string vs module)
                const content = typeof mod === 'string' ? mod : (mod as any).default || mod;

                if (typeof content !== 'string') {
                    console.error(`Invalid content type for ${path}:`, typeof content);
                    return null;
                }

                try {
                    const parsed = frontMatter<FrontMatterAttributes>(content);
                    const attributes = parsed.attributes;
                    const body = parsed.body;

                    // Extract slug from filename
                    const filename = path.split('/').pop() || "";
                    const slug = filename.replace('.md', '');

                    // Validate date
                    let dateStr = "";
                    if (attributes.date) {
                        try {
                            dateStr = new Date(attributes.date).toISOString().split('T')[0];
                        } catch (e) {
                            console.error(`Invalid date in ${path}`);
                        }
                    }
                    if (!dateStr) dateStr = "1970-01-01"; // Fallback

                    return {
                        slug,
                        date: dateStr,
                        author: attributes.author || "observer",
                        body: body.trim(),
                    };
                } catch (e) {
                    console.error(`Error parsing ${path}:`, e);
                    return null;
                }
            }).filter((post): post is UlluPost => post !== null);

            // Sort newest first
            loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setPosts(loadedPosts);
        };

        loadPosts();
    }, []);

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

    const visiblePravachans = posts.slice(0, visibleCount);

    return (
        <div className="mx-auto max-w-3xl p-6 text-gray-200 min-h-screen">
            <h1 className="text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Ullu Pravachan
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                {visiblePravachans.map((p) => (
                    <Link
                        key={p.slug}
                        to={`/ullu/${p.slug}`}
                        className="block group"
                    >
                        <div
                            className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-sm h-full hover:border-white/20 transition-all duration-300 hover:bg-black/50"
                        >
                            <div className="text-sm opacity-60 mb-3 font-mono">{p.date}</div>

                            <pre className="whitespace-pre-wrap text-lg leading-relaxed font-light font-sans text-gray-100">
                                {p.body}
                            </pre>

                            <div className="mt-4 text-sm opacity-60 text-right italic">
                                — {p.author}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Sentinel for infinite scroll */}
            {visibleCount < posts.length && (
                <div ref={loaderRef} style={{ height: "40px", width: "100%" }}></div>
            )}
        </div>
    );
}
