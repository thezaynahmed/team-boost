"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    pauseOnHover?: boolean;
}

export default function Marquee({
    children,
    className,
    duration = 30,
    pauseOnHover = true,
}: MarqueeProps) {
    return (
        <div className={cn("overflow-hidden w-full group", className)}>
            <div
                className={cn(
                    "flex w-max animate-marquee items-center gap-8",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}
                style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
            >
                {children}
                {children}
            </div>
        </div>
    );
}
