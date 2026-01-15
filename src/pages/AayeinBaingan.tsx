
import { useEffect } from "react";

interface AayeinBainganProps {
    is404?: boolean;
}

const AayeinBaingan = ({ is404 = false }: AayeinBainganProps) => {
    useEffect(() => {
        document.title = is404 ? "404 | No Work Labs" : "Aayein? Baingan.";
    }, [is404]);

    return (
        <div className="relative min-h-screen bg-background text-white flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white overflow-hidden"
            style={{ backgroundColor: '#0E0E0E' }}>

            {/* 404 Notification */}
            {is404 && (
                <div className="absolute top-8 left-0 w-full flex justify-center z-20 animate-in slide-in-from-top-4 duration-700">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1 backdrop-blur-sm">
                        <p className="text-red-400 text-xs tracking-widest uppercase font-light">
                            404 — Lost Signal
                        </p>
                    </div>
                </div>
            )}

            <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-in fade-in duration-1000 slide-in-from-bottom-8">

                <div className="text-center space-y-12">

                    {/* Header Section */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                            Aayein?
                        </h1>
                        <h2 className="text-3xl md:text-4xl text-purple-400">
                            Baingan.
                        </h2>
                    </div>

                    {/* Minimal Content */}
                    <div className="space-y-6 text-neutral-400 text-lg">
                        <p>Some answers are not explanations.</p>
                        <p>Some confusion is intentional.</p>
                    </div>

                    <div className="h-px w-12 bg-neutral-800 mx-auto" />

                    {/* Explanation */}
                    <div className="space-y-6 text-neutral-300">
                        <p className="text-sm uppercase tracking-widest text-neutral-500">
                            Why this exists
                        </p>
                        <p className="italic text-xl">
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
            </div>

            {/* Hidden SEO meta equivalent */}
            <div className="hidden">
                Aayein Baingan meaning explanation meme connection. No Work Labs.
            </div>
        </div>
    );
};

export default AayeinBaingan;
