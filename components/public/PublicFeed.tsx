"use client";

import { useState, useRef } from "react";
import Masonry from "react-masonry-css";
import TactileNoteCard from "@/components/ui/TactileNoteCard";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useVelocity
} from "framer-motion";
import { Search, Command, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const mockNotes = [
    { content: "Huge shoutout to the design team for the incredible new icons! They look stunning.", author: "Sarah J.", color: "blue" as const },
    { content: "Thanks @Mark for staying late to help me debug that critical issue. You're a lifesaver.", author: "David C.", color: "purple" as const },
    { content: "The new coffee machine is the best thing that happened to this office. ☕️", author: "Jenny L.", color: "neutral" as const },
    { content: "Congratulations to the sales team for hitting the quarterly target early! 🎉", author: "Michael B.", color: "green" as const },
    { content: "Loving the new remote work policy. It really helps with work-life balance.", author: "Emily R.", color: "pink" as const },
    { content: "Great job on the presentation today, Alice. You nailed it!", author: "Tom H.", color: "orange" as const },
    { content: "Who brought the homemade cookies? They are delicious! 🍪", author: "Kevin Durant", color: "blue" as const },
    { content: "I appreciate the transparency in the all-hands meeting. Keep it up leadership.", author: "Anon", color: "purple" as const },
    { content: "The documentation for the new API is crystal clear. Well done devs.", author: "Frontend Team", color: "neutral" as const },
    { content: "Happy Birthday to our favorite office dog, Sparky! 🐶", author: "Everyone", color: "orange" as const },
    { content: "Just wanted to say thanks for the warm welcome. This team rocks!", author: "Newbie", color: "green" as const },
    { content: "The new dashboard update is silky smooth. Great work engineering!", author: "Product", color: "blue" as const },
    { content: "Thanks for covering my shift yesterday. I owe you one!", author: "Jessica", color: "pink" as const },
    { content: "Those new react hooks are cleaner than my apartment. pure joy.", author: "Dev Team", color: "purple" as const },
    { content: "Can we talk about how good the lunch catering was today? 🥗", author: "Foodie", color: "neutral" as const },
    { content: "Big ups to the support team for handling that outage like pros.", author: "CTO", color: "blue" as const },
];

const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
};

export default function PublicFeed({ searchTerm = "" }: { searchTerm?: string }) {
    const [isHoveringGrid, setIsHoveringGrid] = useState(false);

    // Physics Engine
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Skew and Scale based on velocity
    const skewY = useTransform(smoothVelocity, [-1000, 1000], [-2, 2]);
    const scale = useTransform(smoothVelocity, [-3000, 0, 3000], [0.98, 1, 0.98]);

    // Use internal search only if needed, but here we prioritize prop for the new design
    // The previous internal state logic is removed to rely on parent control or direct prop usage.
    // If we wanted to keep standalone functionality, we could fallback, but we're moving it to page.tsx.
    const filteredNotes = mockNotes.filter(n => n.content.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full relative z-10 pb-40">

            {/* The Infinite Stream (Grid) */}
            <motion.div
                style={{ skewY, scale }}
                className={cn(
                    "w-full transition-opacity duration-500",
                    isHoveringGrid ? "opacity-100" : "opacity-100"
                )}
                onMouseEnter={() => setIsHoveringGrid(true)}
                onMouseLeave={() => setIsHoveringGrid(false)}
            >
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-6"
                    columnClassName="pl-6 bg-clip-padding"
                >
                    {filteredNotes.map((note, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{
                                duration: 0.8,
                                delay: (i % 3) * 0.1, // Stagger based on column position roughly
                                type: "spring",
                                bounce: 0.2
                            }}
                            className="mb-8 group relative"
                        >
                            {/* Focus Mode: Dim siblings logic handled via CSS group-hover on parent if possible, 
                                or we simplify by making the active one pop and using a backdrop on the page. 
                                For now, we scale up the active one. */}
                            <div className="transition-all duration-300 hover:scale-[1.02] hover:z-50 hover:-translate-y-2">
                                <TactileNoteCard
                                    {...note}
                                    variant="readonly"
                                    className="backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 transition-colors shadow-lg"
                                />
                            </div>
                        </motion.div>
                    ))}
                </Masonry>
            </motion.div>

        </div>
    );
}
