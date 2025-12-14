"use client";

import { motion } from "framer-motion";

export default function BackgroundGrid() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-neutral-950">
            {/* Grid Pattern with Mask */}
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            {/* Glowing Orb / Spotlight */}
            <motion.div
                className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"
            />

            {/* Secondary Glow */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] mix-blend-screen" />

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.05]" />
        </div>
    );
}
