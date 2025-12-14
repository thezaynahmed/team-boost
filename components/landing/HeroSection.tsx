"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import HeroVisual from "@/components/ui/HeroVisual";
import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HeroSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
        show: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { type: "spring" as const, stiffness: 60, damping: 20 }
        },
    };

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-32 pb-20">
            <BackgroundGrid />

            <div className="container px-4 md:px-6 z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-full flex flex-col items-center"
                >
                    {/* Badge */}
                    <motion.div variants={item} className="mb-6">
                        <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-sm font-medium text-indigo-300 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
                            v2.0 is live — Experience the boost
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={item}
                        className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]"
                    >
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-sm">
                            Boost Team
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 pb-4 animate-gradient-x drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                            Morale Daily.
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        variants={item}
                        className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed tracking-tight"
                    >
                        The digital gratitude wall for high-performing teams.
                        Share wins, recognize efforts, and build culture in real-time.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        variants={item}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
                    >
                        <Link href="/dashboard">
                            <MagneticButton className="min-w-[160px] h-14 px-8 py-4 bg-white text-black hover:bg-neutral-100 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)] border-none">
                                <span className="text-base font-bold tracking-tight">Start Writing</span>
                                <ArrowRight className="w-4 h-4" />
                            </MagneticButton>
                        </Link>
                        <Link href="/public">
                            <MagneticButton variant="secondary" className="min-w-[160px] h-14 px-8 py-4 border-white/20 hover:border-white/50 bg-black/20 backdrop-blur-xl">
                                <span className="text-base font-medium tracking-tight">View Public Wall</span>
                                <Globe className="w-4 h-4" />
                            </MagneticButton>
                        </Link>
                    </motion.div>

                    {/* Hero Visual (3D Dashboard) */}
                    <HeroVisual />

                </motion.div>
            </div>
        </section>
    );
}
