
import { useEffect } from "react";

const AayeinBaingan = () => {
    useEffect(() => {
        document.title = "Aayein? Baingan.";
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
            <div className="max-w-md w-full text-center space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-8">

                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                        Aayein?
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-light text-purple-400">
                        Baingan.
                    </h2>
                </div>

                {/* Minimal Content */}
                <div className="space-y-6 text-neutral-400 font-light text-lg">
                    <p>Some answers are not explanations.</p>
                    <p>Some confusion is intentional.</p>
                </div>

                <div className="h-px w-12 bg-neutral-800 mx-auto" />

                {/* Explanation */}
                <div className="space-y-6 text-neutral-300">
                    <p className="text-sm uppercase tracking-widest text-neutral-500">
                        Why this exists
                    </p>
                    <p className="italic font-serif text-xl">
                        “What does Aayein Baingan mean?”
                    </p>

                    <div className="space-y-1">
                        <p>It means:</p>
                        <p className="text-white">You reached the edge of understanding.</p>
                        <p>And instead of forcing sense —</p>
                        <p className="text-purple-400">you’re invited to play.</p>
                    </div>
                </div>

                <div className="pt-8">
                    <a
                        href="https://baingan.wtf"
                        className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm group"
                    >
                        → <span className="underline decoration-transparent group-hover:decoration-white underline-offset-4 transition-all">baingan.wtf</span>
                    </a>
                </div>

            </div>

            {/* Hidden SEO meta equivalent since we can't easily inject into head here without Helmet, 
          but Google reads the body text which covers the requirements. 
      */}
            <div className="hidden">
                Aayein Baingan meaning explanation meme connection. No Work Labs.
            </div>
        </div>
    );
};

export default AayeinBaingan;
