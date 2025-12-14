"use client";

import { motion } from "framer-motion";

export default function MeshBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-neutral-950/80 pointer-events-none">
            {/* Noise Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.05] z-50 mix-blend-overlay" />

            {/* Gradient 1: Neon Purple */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                    rotate: [0, 45, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-neon-purple rounded-full blur-[120px] opacity-30 mix-blend-screen"
            />

            {/* Gradient 2: Neon Blue */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.5, 0.2],
                    x: [0, 50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[0%] w-[60vw] h-[60vw] bg-neon-blue rounded-full blur-[140px] opacity-30 mix-blend-screen"
            />

            {/* Gradient 3: Deep Indigo */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-900 rounded-full blur-[100px] opacity-40 mix-blend-screen"
            />
        </div>
    );
}
