import React, { useState, useEffect } from "react";
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
    const [selectedPost, setSelectedPost] = useState<UlluPost | null>(null);
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
        <div className="w-full px-6 py-6 text-gray-200 min-h-screen">
            <h1 className="text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Ullu Pravachan
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {visiblePravachans.map((p) => (
                    <div
                        key={p.slug}
                        onClick={() => setSelectedPost(p)}
                        className="cursor-pointer group"
                    >
                        <div
                            className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-sm h-full w-full flex flex-col hover:border-white/20 transition-all duration-300 hover:bg-black/50 overflow-hidden"
                        >
                            <div className="text-sm opacity-60 mb-2 font-mono shrink-0">{p.date}</div>

                            <pre className="whitespace-pre-wrap text-base leading-relaxed font-light font-sans text-gray-100 flex-grow overflow-hidden text-ellipsis">
                                {p.body}
                            </pre>

                            <div className="mt-2 text-sm opacity-60 text-right italic shrink-0">
                                — {p.author}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sentinel for infinite scroll */}
            {visibleCount < posts.length && (
                <div ref={loaderRef} style={{ height: "40px", width: "100%" }}></div>
            )}

            {/* Overlay Modal */}
            {selectedPost && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all scale-100 backdrop-filter backdrop-blur-md"
                        onClick={(e) => e.stopPropagation()} // Prevent close on clicking card content
                    >
                        <div className="text-sm opacity-60 mb-4 font-mono">{selectedPost.date}</div>

                        <pre className="whitespace-pre-wrap text-xl md:text-2xl leading-relaxed font-light font-sans text-gray-100">
                            {selectedPost.body}
                        </pre>

                        <div className="mt-6 text-lg opacity-60 text-right italic">
                            — {selectedPost.author}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
