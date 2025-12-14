"use client";

import { useRef, useState } from "react";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PublicFeed from "@/components/public/PublicFeed";
import Link from "next/link";
import { ArrowLeft, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PublicPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const [searchTerm, setSearchTerm] = useState("");

    // Parallax Header (0.5x speed - moves slower than scroll)
    const headerY = useTransform(scrollY, [0, 1000], [0, 500]);
    const headerOpacity = useTransform(scrollY, [0, 400], [1, 0.2]); // Fade out slowly

    // Command Bar Entrance
    const barScale = useTransform(scrollY, [0, 200], [0.95, 1]);

    return (
        <>
            <FloatingNavbar />
            <SmoothScroll>
                <div
                    ref={containerRef}
                    className="bg-neutral-950 min-h-screen relative overflow-hidden"
                >
                    {/* Background Architecture */}
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        {/* Base Grid */}
                        <div className="absolute inset-0 bg-neutral-950" />
                        <div className="absolute inset-0 bg-grid-white opacity-[0.4] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />

                        {/* Atmosphere: Deep, slow-moving Aurora (Darker & Subtler) */}
                        <motion.div
                            animate={{
                                opacity: [0.1, 0.2, 0.1],
                                rotate: [0, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-[20%] -left-[10%] w-[1200px] h-[1200px] bg-indigo-900/20 rounded-full blur-[180px] mix-blend-screen"
                        />
                        <motion.div
                            animate={{
                                opacity: [0.1, 0.15, 0.1],
                                x: [0, 50, 0]
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[10%] right-[-10%] w-[1000px] h-[1000px] bg-purple-900/15 rounded-full blur-[150px] mix-blend-screen"
                        />

                        {/* Grain */}
                        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
                    </div>

                    <main className="relative z-10 min-h-screen">

                        {/* Massive Header Section */}
                        <motion.header
                            style={{ y: headerY, opacity: headerOpacity }}
                            className="pt-64 px-6 md:px-12 max-w-[1800px] mx-auto mb-32 relative"
                        >
                            {/* Back Link with Magnetic Feel */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center text-neutral-500 hover:text-white mb-12 transition-colors group"
                                >
                                    <div className="p-2 rounded-full border border-white/5 bg-white/5 mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <ArrowLeft className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide">Back to Home</span>
                                </Link>
                            </motion.div>

                            {/* Massive Editorial Title */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            >
                                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white leading-[0.9]">
                                    Public Wall of <br />
                                    {/* Shine Effect on Motivation */}
                                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400 animate-shimmer bg-[length:200%_auto]">
                                        Motivation.
                                    </span>
                                </h1>
                                {/* Abstract Decorative Element */}
                                <div className="absolute top-0 right-0 md:right-24 hidden lg:block opacity-20">
                                    <Sparkles className="w-32 h-32 text-indigo-500 animate-pulse-slow" />
                                </div>
                            </motion.div>
                        </motion.header>

                        {/* Sticky Command Bar */}
                        <div className="sticky top-24 z-40 px-6 md:px-12 max-w-[1800px] mx-auto pointer-events-none mb-16">
                            {/* Wrapper for pointer events auto */}
                            {/* Entrance Animation + Scroll Scale */}
                            <motion.div
                                style={{ scale: barScale }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                                className="pointer-events-auto max-w-2xl"
                            >
                                <div className="relative group">
                                    {/* Glow */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />

                                    {/* Glass Container */}
                                    <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl ring-1 ring-white/5 transition-all duration-300 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 mr-3 text-neutral-400">
                                            <Search className="w-5 h-5" />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Search by keyword, author, or tag..."
                                            className="bg-transparent border-none text-white placeholder-neutral-500 flex-1 h-10 focus:outline-none focus:ring-0 text-lg font-medium"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />

                                        <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-2">
                                            <div className="px-2 py-1 rounded bg-white/5 text-xs text-neutral-400 font-mono hidden sm:block">
                                                ⌘K
                                            </div>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white">
                                                <SlidersHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* The Feed - Cascading In */}
                        <div className="px-6 md:px-12 max-w-[1800px] mx-auto relative z-30 pb-32">
                            <PublicFeed searchTerm={searchTerm} />
                        </div>

                    </main>
                </div>
            </SmoothScroll>
        </>
    );
}
