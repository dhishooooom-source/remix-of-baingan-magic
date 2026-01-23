import React, { useState, useEffect } from "react";
import frontMatter from "front-matter";
import NullField from "@/components/NullField";

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
        <div className="relative min-h-screen bg-background overflow-hidden font-sans">
            <NullField />

            <div className="relative z-10 w-full px-4 sm:px-8 py-12 md:py-20 text-gray-200">
                <header className="mb-20 text-center animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase text-white/90 mb-6 drop-shadow-lg">
                        Ullu Pravachan
                    </h1>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-6"></div>
                    <p className="text-xs md:text-sm font-mono text-white/40 tracking-[0.2em] uppercase">
                        Tiny truths from the void
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 max-w-[1920px] mx-auto">
                    {visiblePravachans.map((p, idx) => (
                        <div
                            key={p.slug}
                            onClick={() => setSelectedPost(p)}
                            className="cursor-pointer group perspective-1000 animate-fade-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div
                                className="relative bg-black/20 border border-white/5 p-6 h-full w-full flex flex-col 
                                hover:bg-white/5 hover:border-white/10 transition-all duration-500 ease-out 
                                group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] rounded-sm"
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="text-[10px] text-white/30 mb-4 font-mono tracking-widest uppercase shrink-0 flex justify-between">
                                    <span>{p.date}</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">:: OPEN</span>
                                </div>

                                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-light font-sans text-gray-300 flex-grow overflow-hidden text-ellipsis line-clamp-[8] opacity-80 group-hover:opacity-100 transition-opacity">
                                    {p.body}
                                </pre>

                                <div className="mt-6 text-[10px] text-white/20 text-right font-mono tracking-widest shrink-0">
                                    // {p.author}
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-2xl transition-all duration-500 animate-in fade-in zoom-in-95"
                        onClick={() => setSelectedPost(null)}
                    >
                        <div
                            className="bg-black/40 border border-white/10 p-8 md:p-16 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-5 duration-500 rounded-sm"
                            onClick={(e) => e.stopPropagation()} // Prevent close on clicking card content
                        >
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors duration-300 font-mono text-xs tracking-widest uppercase border border-white/5 hover:border-white/30 px-3 py-1 rounded-sm"
                            >
                                Close [X]
                            </button>

                            <div className="text-xs text-white/30 mb-10 font-mono tracking-[0.2em] uppercase border-b border-white/5 pb-4">
                                {selectedPost.date}
                            </div>

                            <pre className="whitespace-pre-wrap text-xl md:text-3xl md:leading-normal leading-relaxed font-extralight font-sans text-gray-100 tracking-wide selection:bg-white/20 selection:text-white">
                                {selectedPost.body}
                            </pre>

                            <div className="mt-16 text-xs text-white/30 text-right font-mono tracking-[0.2em] pt-6 border-t border-white/5 uppercase">
                                // OBSERVED BY {selectedPost.author}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
