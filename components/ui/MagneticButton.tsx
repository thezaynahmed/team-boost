"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

export default function MagneticButton({
    children,
    className,
    onClick,
    variant = "primary",
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseStyles = "relative rounded-full font-medium transition-colors duration-300 flex items-center justify-center group overflow-hidden";

    // Removing padding and gap from baseStyles to allow flexible sizing via className or children layout
    // We will rely on the passed className or default to some padding in specific usages if needed, 
    // but looking at HeroSection usage, we might want to keep some defaults but allow flex-col.
    // Actually, 'flex' is in baseStyles. If I want vertical stack, I should be able to pass 'flex-col' in className.
    // However, 'items-center justify-center gap-2' are also there.

    // Let's modify baseStyles to match the new desired pill shape more generally, or just keep it flexible.
    // The screenshot shows very large buttons.

    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)]",
        secondary: "bg-transparent text-white border border-white/20 hover:border-white/50 backdrop-blur-md hover:bg-white/5",
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn("relative px-10 py-6 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 text-lg group overflow-hidden", variants[variant], className)}
            onClick={onClick}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
        </motion.button>
    );
}
