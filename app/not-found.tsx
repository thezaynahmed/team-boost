"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";
import TactileNoteCard from "@/components/ui/TactileNoteCard";
import MagneticButton from "@/components/ui/MagneticButton";

export default function NotFound() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Handle window resize and set initial position to center
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateDimensions();
        // Set initial mouse position to center to minimize initial jump/spring
        // but allow a small "settle" animation
        mouseX.set(window.innerWidth / 2);
        mouseY.set(window.innerHeight / 2);

        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [mouseX, mouseY]);

    // Smooth mouse physics (Heavy & Premium feel)
    const springConfig = { stiffness: 100, damping: 30 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Simple Repulsion: Note moves slightly AWAY from mouse
    // We assume center of screen is 0,0 relative to movement
    // Server/Initial Render uses 0 dimensions so result is 0 (transform: none) matching server
    const moveX = useTransform(x, (value) => (value - dimensions.width / 2) * -0.05);
    const moveY = useTransform(y, (value) => (value - dimensions.height / 2) * -0.05);

    function handleMouseMove(e: React.MouseEvent) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950"
        >
            {/* Background: Subtle Gradient Spot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Giant Watermark */}
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter">
                404
            </h1>

            {/* The Floating Note */}
            <motion.div
                style={{ x: moveX, y: moveY }}
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 2, 0, -2, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-20"
            >
                <div className="w-80 pointer-events-none">
                    <TactileNoteCard
                        content="Oops. I think we floated too far."
                        author="System"
                        color="yellow"
                        variant="readonly"
                        className="shadow-2xl rotate-3"
                    />
                </div>
            </motion.div>

            {/* Clean UI at Bottom */}
            <div className="absolute bottom-16 z-30 flex flex-col items-center gap-6 w-full max-w-sm px-6">
                <p className="text-neutral-500 font-medium">Error 404 — Page Not Found</p>

                <div className="flex items-center gap-3">
                    <Link href="/">
                        <MagneticButton className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            <Home className="w-4 h-4 mr-2" />
                            Return Home
                        </MagneticButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}