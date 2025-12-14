"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Public Wall", href: "/public" },
    { name: "Pricing", href: "/#pricing" },
];

export function FloatingNavbar() {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll and scale background when menu is open
    useEffect(() => {
        const mainContent = document.querySelector("main");
        if (isOpen) {
            document.body.style.overflow = "hidden";
            if (mainContent) {
                // Apply transition only when needed
                mainContent.style.transition = "transform 0.6s cubic-bezier(0.32, 0.72, 0, 1), filter 0.6s ease";
                mainContent.style.transform = "scale(0.95)";
                mainContent.style.filter = "brightness(0.5) blur(4px)";
                mainContent.style.borderRadius = "20px";
            }
        } else {
            document.body.style.overflow = "";
            if (mainContent) {
                // Reset
                mainContent.style.transform = "scale(1)";
                mainContent.style.filter = "brightness(1) blur(0px)";
                mainContent.style.borderRadius = "0px";
                // Ideally remove transition after completion, but keeping it is fine for now
            }
        }
    }, [isOpen]);

    return (
        <div className={cn(
            "fixed inset-x-0 z-[100] flex justify-center px-4 pointer-events-none",
            isOpen ? "top-4 bottom-4" : "top-6"
        )}>
            <motion.div
                layout
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={{
                    open: {
                        width: "100%",
                        maxWidth: "400px",
                        height: "100%",
                        borderRadius: "24px",
                    },
                    closed: {
                        width: "auto", // Keeps it wrapping content
                        height: "auto",
                        borderRadius: "9999px",
                    }
                }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 35,
                    mass: 0.8
                }}
                className={cn(
                    "pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden relative flex flex-col",
                    // Safeguard: Ensure min-width reflects the content
                    !isOpen && "min-w-fit"
                )}
                style={{ originY: 0 }}
            >
                {/* Background glow effect */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"
                    />
                )}

                {/* Header Part (Always Visible but morphs layout) */}
                <div className={cn("flex items-center justify-between w-full shrink-0", isOpen ? "p-5" : "px-3 py-2 md:px-4")}>

                    {/* Logo */}
                    <div className={cn("flex items-center justify-start transition-none", isOpen ? "min-w-[120px]" : "min-w-fit md:min-w-[140px]")}>
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 pl-1 group">
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="rounded-full bg-indigo-500/20 p-2 group-hover:bg-indigo-500/30 transition-colors"
                            >
                                <Zap className="h-5 w-5 text-indigo-400 fill-current" />
                            </motion.div>
                            <span className={cn(
                                "font-bold tracking-tight text-white/90 whitespace-nowrap",
                                isOpen ? "text-xl block" : "hidden sm:block text-sm md:text-base",
                            )}>
                                TeamBoost
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav (Hidden on Mobile) */}
                    {!isOpen && (
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 mx-auto shrink-0">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onMouseEnter={() => setActiveTab(link.name)}
                                    onMouseLeave={() => setActiveTab(null)}
                                    className={cn(
                                        "relative px-4 py-1.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors rounded-full block whitespace-nowrap"
                                    )}
                                >
                                    {activeTab === link.name && (
                                        <motion.div
                                            layoutId="hover-pill"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Actions & Toggle */}
                    <div className={cn("flex items-center justify-end gap-2", !isOpen && "min-w-fit md:min-w-[140px]")}>
                        {!isOpen && (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-sm font-medium text-neutral-400 hover:text-white hover:bg-transparent px-3 h-8">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/get-started">
                                    <div className="group relative p-[1px] rounded-full overflow-hidden bg-gradient-to-r from-cyan-400 to-purple-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-80 group-hover:opacity-100 blur-sm transition-opacity" />
                                        <button className="relative px-4 py-1.5 bg-black rounded-full text-sm font-medium text-white transition-all group-hover:bg-black/90 flex items-center gap-2 whitespace-nowrap">
                                            Get Started
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "p-2.5 rounded-full transition-all duration-200 relative z-50",
                                isOpen
                                    ? "text-white bg-white/10 hover:bg-white/20"
                                    : "text-white/70 hover:text-white hover:bg-white/10 md:hidden"
                            )}
                            whileTap={{ scale: 0.9 }}
                            initial={false}
                        >
                            {/** Removed layout="position" from button itself to avoid conflict with parent width */}
                            <AnimatePresence mode="wait" initial={false}>
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu Content (Expanded State) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full flex flex-col px-5 pb-8"
                        >
                            <div className="flex flex-col gap-2 mt-4">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        transition={{ delay: 0.1 + (i * 0.05), duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98]"
                                        >
                                            <span className="text-lg font-medium text-white/90 group-hover:text-white">{link.name}</span>
                                            <div className="flex items-center text-white/40 group-hover:text-indigo-400 transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6 w-full"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="flex flex-col gap-3"
                            >
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-center text-neutral-300 h-12 rounded-xl text-base font-medium hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/get-started" onClick={() => setIsOpen(false)}>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full relative group overflow-hidden bg-white text-black h-14 rounded-xl text-lg font-bold shadow-xl shadow-indigo-500/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Get Started
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
