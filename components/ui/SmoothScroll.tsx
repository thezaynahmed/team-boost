"use client";

import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
    children: React.ReactNode;
}

function SmoothScroll({ children }: SmoothScrollProps) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            {children as any}
        </ReactLenis>
    );
}

export default SmoothScroll;
