"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
    wrap
} from "framer-motion";
import TactileNoteCard from "@/components/ui/TactileNoteCard";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const notes = [
    { content: "Always appreciates the little things. You are a star!", author: "Alex D.", color: "blue" as const },
    { content: "Great mentorship this week! Learned so much.", author: "Sam K.", color: "purple" as const },
    { content: "The new design is fire 🔥. Loving the dark mode.", author: "Jordan P.", color: "pink" as const },
    { content: "Fixed that bug in record time. Saved the day!", author: "Casey L.", color: "green" as const },
    { content: "Brought donuts! 🍩 Best team player ever.", author: "Taylor R.", color: "orange" as const },
    { content: "Code review was super helpful. Thanks!", author: "Jamie T.", color: "blue" as const },
    { content: "Helping me debug that issue was life saving.", author: "Morgan S.", color: "purple" as const },
    { content: "Your positive energy is infectious!", author: "Riley M.", color: "pink" as const },
];

// --- Velocity Marquee Component ---
interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity: number;
    className?: string;
}

function VelocityMarquee({ children, baseVelocity = 100, className }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Convert scroll velocity to acceleration for the marquee
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        // Apply velocity from scroll
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
            <motion.div className={cn("flex flex-nowrap gap-8", className)} style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}


export default function PublicPreviewSection() {
    return (
        <section className="relative py-40 bg-neutral-950 overflow-hidden flex flex-col items-center min-h-screen justify-center">

            {/* Background Mesh Gradient (Ethereal Backlight) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950 z-0 pointer-events-none" />

            {/* Spotlight Mask (Focuses attention on center) */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />

            <div className="container relative z-30 px-4 text-center mb-20">
                <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6 tracking-tighter">
                    The River of Thoughts
                </h2>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                    A global stream of gratitude, recognition, and team wins.
                </p>
            </div>

            {/* --- The River (3D Tilted Stream) --- */}
            <div
                className="relative w-full z-10 perspective-[1000px] mb-20"
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Tilted Container */}
                <div
                    className="w-full flex flex-col gap-12"
                    style={{
                        transform: "rotateY(-10deg) rotateZ(4deg) scale(1.1)",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Layer 1: Background (Fast, blurred, lower opacity) */}
                    <div className="opacity-30 blur-[2px] pointer-events-none scale-90">
                        <VelocityMarquee baseVelocity={-2.17} className="gap-16">
                            {notes.map((note, i) => (
                                <div key={i} className="w-[200px] sm:w-[250px] md:w-[300px] shrink-0">
                                    <div className="h-32 rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            ))}
                        </VelocityMarquee>
                    </div>

                    {/* Layer 2: Middle (Medium speed) */}
                    <div className="opacity-60 scale-95 -my-8">
                        <VelocityMarquee baseVelocity={2.89} className="gap-12">
                            {notes.slice().reverse().map((note, i) => (
                                <TactileNoteCard
                                    key={i}
                                    variant="readonly"
                                    content={note.content}
                                    author={note.author}
                                    color={note.color}
                                    className="w-[240px] sm:w-[300px] md:w-[350px] shrink-0 grayscale opacity-80"
                                />
                            ))}
                        </VelocityMarquee>
                    </div>

                    {/* Layer 3: Foreground (Slow, sharpness, interactive) */}
                    <div className="z-10 relative">
                        <VelocityMarquee baseVelocity={-1.45} className="gap-8">
                            {notes.map((note, i) => (
                                <div key={i} className="w-[280px] sm:w-[340px] md:w-[400px] shrink-0 transform-gpu hover:scale-110 hover:z-50 hover:brightness-125 transition-all duration-300">
                                    <TactileNoteCard
                                        variant="readonly"
                                        content={note.content}
                                        author={note.author}
                                        color={note.color}
                                        className="h-full shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] border-white/10 hover:border-white/40"
                                    />
                                </div>
                            ))}
                        </VelocityMarquee>
                    </div>

                </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-30 mt-10">
                <Link href="/public">
                    <MagneticButton className="px-12 py-5 bg-white text-black hover:bg-neutral-200 shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] border-none">
                        <span className="text-lg font-bold">Dive into the Stream</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </MagneticButton>
                </Link>
            </div>

        </section>
    );
}
