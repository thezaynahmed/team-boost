"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import TactileNoteCard from "@/components/ui/TactileNoteCard";
import { cn } from "@/lib/utils";

// --- Types ---
interface StoryPhase {
    opacity: MotionValue<number>;
    scale: MotionValue<number>;
    y: MotionValue<number>;
    blur: MotionValue<number>;
}

export default function StorySection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // --- Scroll Sequences (0-1 range over 400vh) ---
    // Phase 1: The Void (0 - 0.25)
    // Phase 2: The Spark (0.25 - 0.5)
    // Phase 3: The Connection (0.5 - 0.85)
    // Phase 4: Exit (0.85 - 1.0)

    // Background Animation
    const bgOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]); // Fades in during Spark
    const bgScale = useTransform(scrollYProgress, [0.4, 0.8], [0.8, 1.2]); // Explodes during Connection
    const bgBrightness = useTransform(scrollYProgress, [0.4, 0.6], [0.5, 1.2]); // Brightens on impact

    // Text Animations
    const text1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.20, 0.3], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0.05, 0.3], [50, -50]);
    const text1Blur = useTransform(scrollYProgress, [0.2, 0.3], [0, 20]);

    const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.45, 0.55], [0, 1, 1, 0]);
    const text2Scale = useTransform(scrollYProgress, [0.3, 0.55], [0.9, 1.1]);
    const text2Blur = useTransform(scrollYProgress, [0.45, 0.55], [0, 20]);

    const text3Opacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
    const text3Scale = useTransform(scrollYProgress, [0.55, 0.8], [0.5, 1]);
    const text3Y = useTransform(scrollYProgress, [0.55, 0.8], [100, 0]);


    // --- Card Swarm Physics ---
    // Cards fly in from Z-axis (scale 0->1) and form a wall
    const cardEntranceStart = 0.5;
    const cardEntranceEnd = 0.75;

    const cards = [
        // Top Left (High)
        {
            x: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-1000, -350]),
            y: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-1000, -250]),
            rotate: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-45, -15]),
            scale: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [0, 1]),
            zIndex: 10,
            content: "You crushed that presentation! 🚀",
            author: "Sarah K.",
            color: "blue"
        },
        // Top Right (High)
        {
            x: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [1000, 350]),
            y: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-800, -200]),
            rotate: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [45, 15]),
            scale: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [0, 0.9]),
            zIndex: 5,
            content: "Thanks for the code review help.",
            author: "Mike T.",
            color: "purple"
        },
        // Center Left
        {
            x: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-1200, -450]),
            y: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [100, 100]),
            rotate: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-90, -5]),
            scale: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [0, 0.85]),
            zIndex: 8,
            content: "Always amazing to work with you.",
            author: "Jessica R.",
            color: "pink"
        },
        // Center Right
        {
            x: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [1200, 450]),
            y: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [200, 150]),
            rotate: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [90, 10]),
            scale: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [0, 0.95]),
            zIndex: 6,
            content: "Huge win for the team today!",
            author: "David L.",
            color: "green"
        },
        // Bottom Left
        {
            x: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-800, -200]),
            y: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [1000, 350]),
            rotate: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [-60, -20]),
            scale: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [0, 1.1]), // Closer
            zIndex: 20, // Highlight
            content: "I appreciate your mentorship.",
            author: "Alex B.",
            color: "orange"
        },
        // Bottom Right
        {
            x: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [800, 200]),
            y: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [1200, 400]),
            rotate: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [60, 20]),
            scale: useTransform(scrollYProgress, [cardEntranceStart, cardEntranceEnd], [0, 1]),
            zIndex: 15,
            content: "Can't wait for the next sprint!",
            author: "Tom H.",
            color: "blue"
        },
    ];

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-neutral-950">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1000px]">

                {/* 1. Cinematic Background (The Mesh) */}
                <motion.div
                    style={{ opacity: bgOpacity, scale: bgScale, filter: useTransform(bgBrightness, b => `brightness(${b})`) }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-neutral-950 to-purple-900 opacity-50" />
                    {/* Living Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-float-slow" />
                    <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-3xl" />
                </motion.div>

                {/* 2. Text Narrative Layer */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center pointer-events-none">

                    {/* Phase 1 Text */}
                    <motion.div
                        style={{ opacity: text1Opacity, y: text1Y, filter: useTransform(text1Blur, b => `blur(${b}px)`) }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-neutral-400 tracking-tighter">
                            Work shouldn't feel <br />
                            <span className="text-neutral-600">isolated.</span>
                        </h2>
                    </motion.div>

                    {/* Phase 2 Text */}
                    <motion.div
                        style={{ opacity: text2Opacity, scale: text2Scale, filter: useTransform(text2Blur, b => `blur(${b}px)`) }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            Until one note...
                        </h2>
                    </motion.div>

                    {/* Phase 3 Text */}
                    <motion.div
                        style={{ opacity: text3Opacity, scale: text3Scale, y: text3Y }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <h2 className="text-6xl md:text-9xl font-extrabold text-white tracking-tighter drop-shadow-2xl z-50">
                            Changes <span className="text-indigo-400">Everything.</span>
                        </h2>
                    </motion.div>
                </div>

                {/* 3. The Swarm (Cards) */}
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        style={{
                            x: card.x,
                            y: card.y,
                            rotate: card.rotate,
                            scale: card.scale,
                            zIndex: card.zIndex,
                        }}
                        className="absolute will-change-transform"
                    >
                        <TactileNoteCard
                            content={card.content}
                            author={card.author}
                            color={card.color as any}
                            className="w-[300px] md:w-[380px] backdrop-blur-xl bg-white/5 border-white/10 shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>
                ))}

            </div>
        </section>
    );
}
