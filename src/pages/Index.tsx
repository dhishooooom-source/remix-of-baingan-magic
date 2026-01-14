import { useState, useEffect } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import aayeinGif from "@/assets/aayein.gif";
import baiganGif from "@/assets/baigan.gif";

const Index = () => {
  const [showBaingan, setShowBaingan] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const message = "Some things don't make sense.\nThat's where play begins.";

  const handleClick = () => {
    if (isTransitioning || showBaingan) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setShowBaingan(true);
      setIsTransitioning(false);
    }, 800);

    setTimeout(() => {
      setShowText(true);
    }, 2800);
  };

  useEffect(() => {
    if (!showText) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedText(message.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [showText]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <FloatingParticles />
      
      <div className="relative z-10 text-center px-4">
        {/* Image Container */}
        <div className="relative inline-block">
          {/* Glow effect behind the image */}
          <div 
            className={`absolute inset-0 rounded-3xl blur-2xl transition-opacity duration-1000 ${
              showBaingan ? "opacity-60" : "opacity-40"
            }`}
            style={{
              background: showBaingan 
                ? "radial-gradient(circle, hsl(320 70% 60% / 0.5), hsl(280 60% 65% / 0.3), transparent)"
                : "radial-gradient(circle, hsl(280 60% 65% / 0.4), hsl(200 70% 50% / 0.2), transparent)",
              transform: "scale(1.2)",
            }}
          />
          
          {/* Aayein GIF */}
          <img
            src={aayeinGif}
            alt="Aayein"
            onClick={handleClick}
            className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] 
              object-cover rounded-3xl cursor-pointer transition-all duration-700 ease-out
              hover:scale-105 glow-card
              ${!showBaingan && !isTransitioning ? "animate-gentle-bounce" : ""}
              ${isTransitioning || showBaingan ? "opacity-0 scale-95" : "opacity-100 scale-100"}
            `}
            style={{
              display: showBaingan ? "none" : "block",
            }}
          />
          
          {/* Baingan GIF */}
          <img
            src={baiganGif}
            alt="Baingan"
            className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] 
              object-cover rounded-3xl transition-all duration-700 ease-out
              animate-pulse-glow
              ${showBaingan ? "opacity-100 scale-100" : "opacity-0 scale-110"}
            `}
            style={{
              display: showBaingan ? "block" : "none",
            }}
          />
        </div>
        
        {/* Text */}
        <div 
          className={`mt-10 transition-all duration-500 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-lg sm:text-xl md:text-2xl font-light text-muted-foreground whitespace-pre-line leading-relaxed tracking-wide">
            {displayedText}
            <span 
              className={`inline-block w-0.5 h-5 sm:h-6 bg-primary ml-1 align-middle ${
                displayedText.length < message.length ? "animate-pulse" : "opacity-0"
              }`}
            />
          </p>
        </div>

        {/* Subtle hint text */}
        {!showBaingan && !isTransitioning && (
          <p className="mt-6 text-xs text-muted-foreground/50 animate-pulse">
            tap to discover
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
