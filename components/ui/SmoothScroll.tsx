"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

interface SmoothScrollProps {
    children: React.ReactNode;
}

function SmoothScroll({ children }: SmoothScrollProps) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            {children}
        </ReactLenis>
    );
}

export default SmoothScroll;
