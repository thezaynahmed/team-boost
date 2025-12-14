"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TactileNoteCardProps {
    content?: string;
    author?: string;
    className?: string;
    variant?: "default" | "readonly";
    color?: "blue" | "purple" | "pink" | "green" | "orange" | "yellow" | "neutral";
}

export default function TactileNoteCard({
    content = "Great work on the release! The team spirit was amazing.",
    author = "Anonymous",
    className,
    variant = "default",
    color = "neutral",
}: TactileNoteCardProps) {
    const isReadOnly = variant === "readonly";

    const colorStyles = {
        blue: "from-neon-blue/10 via-neon-blue/5 to-transparent border-neon-blue/30 shadow-[0_0_15px_-3px_rgba(var(--neon-blue),0.2)]",
        purple: "from-neon-purple/10 via-neon-purple/5 to-transparent border-neon-purple/30 shadow-[0_0_15px_-3px_rgba(var(--neon-purple),0.2)]",
        pink: "from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/30 shadow-[0_0_15px_-3px_rgba(236,72,153,0.2)]",
        green: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]",
        orange: "from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]",
        yellow: "from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-500/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]",
        neutral: "from-white/10 via-white/5 to-transparent border-white/10",
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn(
                "relative p-6 rounded-xl border backdrop-blur-xl transition-all duration-300",
                "bg-gradient-to-br shadow-lg",
                colorStyles[color],
                "group",
                isReadOnly ? "cursor-default" : "cursor-pointer hover:shadow-2xl hover:border-white/30",
                className
            )}
        >
            {/* Glass Prism Effect */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] rounded-xl pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-t-xl pointer-events-none" />

            <p className="text-lg text-white/90 font-medium leading-relaxed mb-6 font-sans whitespace-normal break-words">
                "{content}"
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
                    <span className="text-sm text-white/60 font-medium tracking-wide">{author}</span>
                </div>
                {isReadOnly && (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                )}
            </div>

            {/* Hover Glow */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
        </motion.div>
    );
}
