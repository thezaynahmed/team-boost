"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHoveringButton, setIsHoveringButton] = useState(false);

    // Scroll Progress for the "Lens" effect
    // As the user scrolls through the section, the text focuses.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    // Text Animations (Scale Down + Blur In)
    const textScale = useTransform(scrollYProgress, [0.2, 1], [1.5, 1]);
    const textBlur = useTransform(scrollYProgress, [0.2, 1], [12, 0]);
    const textOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen min-h-[800px] w-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950"
        >

            {/* 1. Atmosphere: The Void & Dynamic Background */}
            {/* When hovering the button, this layer dims everything else */}
            <motion.div
                animate={{ opacity: isHoveringButton ? 0.8 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-black z-20 pointer-events-none"
            />

            {/* The Grid: 3D Perspective Floor (Warp Speed) */}
            <div className="absolute inset-0 z-0 perspective-[500px] opacity-30">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"
                    style={{
                        transform: "rotateX(60deg) scale(2)",
                        transformOrigin: "bottom center",
                        animation: "grid-move 20s linear infinite",
                    }}
                />
            </div>
            {/* Custom Keyframe definition needed for grid-move, but we can simulate with framer motion or just standard css in global if prefered. 
                For now, I'll add a style tag for this specific one to be self-contained or use Framer Motion for the infinite loop.
            */}
            <motion.div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    transform: "perspective(500px) rotateX(60deg) translateY(0%) scale(3)",
                    transformOrigin: "bottom",
                }}
                animate={{
                    backgroundPositionY: ["0px", "60px"],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />


            {/* The Light: Massive Spotlight God-Ray */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-gradient-to-b from-white/10 to-transparent blur-[140px] pointer-events-none z-0 mix-blend-screen" />


            {/* 2. Massive Typography: The Event Horizon */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center -mt-20">
                <motion.h2
                    style={{ scale: textScale, filter: useTransform(textBlur, (b) => `blur(${b}px)`), opacity: textOpacity }}
                    className="text-[15vw] leading-[0.8] font-bold text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 select-none"
                >
                    READY TO
                </motion.h2>

                <motion.h2
                    style={{ scale: textScale, filter: useTransform(textBlur, (b) => `blur(${b}px)`), opacity: textOpacity }}
                    className="text-[15vw] leading-[0.8] font-bold text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 select-none"
                >
                    BOOST?
                </motion.h2>
            </div>


            {/* 3. The Singularity Button */}
            <motion.div
                className="absolute bottom-20 z-30"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
            >
                <Link href="/dashboard">
                    <MagneticButton
                        className="h-24 px-12 rounded-full bg-white text-black hover:scale-105 transition-all duration-500 shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:shadow-[0_0_100px_-10px_rgba(255,255,255,0.8)] border-none"
                    >
                        <span className="text-2xl font-bold tracking-tight mr-4">Get Started</span>
                        <ArrowRight className="w-6 h-6" />
                    </MagneticButton>
                </Link>
            </motion.div>


            {/* Floating Particles (Noise) */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay bg-noise" />

        </section>
    );
}
