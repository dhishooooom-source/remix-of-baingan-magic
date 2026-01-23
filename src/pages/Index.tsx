import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NullField from "@/components/NullField";
import frontMatter from "front-matter";

interface FrontMatterAttributes {
  date: string | Date;
  author?: string;
}

const Index = () => {
  const [showBaingan, setShowBaingan] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [latestPravachan, setLatestPravachan] = useState("");

  useEffect(() => {
    const loadLatestPost = async () => {
      const modules = import.meta.glob('../../content/ullu/*.md', { query: '?raw', import: 'default', eager: true });

      const posts = Object.entries(modules).map(([_, mod]) => {
        const content = typeof mod === 'string' ? mod : (mod as any).default || mod;
        if (typeof content !== 'string') return null;
        try {
          const parsed = frontMatter<FrontMatterAttributes>(content);
          return {
            date: new Date(parsed.attributes.date),
            body: parsed.body.trim()
          };
        } catch { return null; }
      }).filter(p => p !== null);

      posts.sort((a, b) => b!.date.getTime() - a!.date.getTime());

      if (posts.length > 0) {
        setLatestPravachan(posts[0]!.body);
      } else {
        setLatestPravachan("Some things don't make sense.\nThat's where play begins.");
      }
    };
    loadLatestPost();
  }, []);

  const handleClick = () => {
    if (showBaingan) return;

    setShowBaingan(true);

    setTimeout(() => {
      setShowText(true);
    }, 150);
  };

  useEffect(() => {
    if (!showText || !latestPravachan) return;

    let i = 0;
    // Faster typing for longer text
    const interval = setInterval(() => {
      if (i < latestPravachan.length) {
        setDisplayedText(latestPravachan.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [showText, latestPravachan]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <h1 className="sr-only">
        Aayein Baingan — No Work Labs exploration space
      </h1>

      <NullField />

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Image/Video Container */}
        <div className="relative inline-block w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px]">
          {/* Glow effect behind the image */}
          <div
            className={`absolute inset-0 rounded-3xl blur-2xl transition-opacity duration-1000 ${showBaingan ? "opacity-60" : "opacity-40"
              }`}
            style={{
              background: showBaingan
                ? "radial-gradient(circle, hsl(320 70% 60% / 0.5), hsl(280 60% 65% / 0.3), transparent)"
                : "radial-gradient(circle, hsl(280 60% 65% / 0.4), hsl(200 70% 50% / 0.2), transparent)",
              transform: "scale(1.2)",
            }}
          />

          {/* Aayein Video (Phase 1, 2, 3) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            width="448"
            height="448"
            poster="/assets/aayein-poster.webp"
            fetchPriority="high"
            onClick={handleClick}
            className={`absolute inset-0 w-full h-full
              object-cover rounded-3xl cursor-pointer transition-all duration-700 ease-out
              hover:scale-105 glow-card aspect-square
              ${!showBaingan && !isTransitioning ? "animate-gentle-bounce" : ""}
              ${isTransitioning || showBaingan ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
            `}
          >
            <source src="/assets/aayein.webm" type="video/webm" />
            <source src="/assets/aayein.mp4" type="video/mp4" />
          </video>

          {/* Baingan Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            width="448"
            height="448"
            poster="/assets/baigan-poster.webp"
            className={`absolute inset-0 w-full h-full
              object-cover rounded-3xl transition-all duration-700 ease-out
              animate-pulse-glow aspect-square
              ${showBaingan ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"}
            `}
          >
            <source src="/assets/baigan.webm" type="video/webm" />
            <source src="/assets/baigan.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Text Area */}
        <div
          className={`mt-8 transition-all duration-500 flex flex-col items-center ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          {showText && (
            <>
              <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground mb-4 opacity-70">
                Ullu Pravachan
              </h2>

              <p className="text-base sm:text-lg md:text-xl font-light font-mono text-foreground/90 whitespace-pre-line leading-relaxed tracking-wide mb-8 min-h-[4rem]">
                {displayedText}
                <span
                  className={`inline-block w-0.5 h-6 bg-primary ml-1 align-middle ${displayedText.length < latestPravachan.length ? "animate-pulse" : "opacity-0"
                    }`}
                />
              </p>

              <div className={`mt-2 transition-all duration-1000 delay-500 ${displayedText.length === latestPravachan.length ? "opacity-100" : "opacity-0"}`}>
                <Link to="/ullu" className="text-lg sm:text-2xl font-mono tracking-widest bg-gradient-to-r from-[#a855f7] to-white bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-500">
                  → Read Ullu Pravachan
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Lab logo and hint */}
        {!showBaingan && !isTransitioning && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <img
              src="/assets/logo.svg"
              alt="No Work Labs"
              className="w-6 h-6 opacity-50 animate-pulse"
            />
            <p className="text-xs text-muted-foreground/50 font-mono">
              tap to discover
            </p>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 left-0 w-full text-center pointer-events-none z-50">
        <p className="text-[10px] text-muted-foreground/30 font-mono font-light tracking-widest uppercase">
          No Work Labs — Where To Fly
        </p>
        <a href="https://en.wikipedia.org/wiki/Absurdism" rel="noopener" className="opacity-0 w-1 h-1 overflow-hidden absolute" aria-label="Absurdism" />
      </div>
    </div>
  );
};

export default Index;
