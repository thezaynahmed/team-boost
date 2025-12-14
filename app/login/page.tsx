"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const handleLogin = () => {
        signIn("microsoft-entra-id", { callbackUrl: "/dashboard" });
    };

    return (
        // Added a base deep blue tint to the whole page background instead of pure black
        <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden bg-[#05050A] lg:grid-cols-2">

            {/* === RIGHT COLUMN (Visual Side) === */}
            <div className="relative order-1 h-[40vh] w-full overflow-hidden bg-neutral-900 lg:order-2 lg:h-auto lg:block">

                {/* 1. Deep Space & Vibrant Background */}
                <div className="absolute inset-0 bg-[#05050A]">
                    {/* Richer top-right gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/40 via-purple-900/20 to-[#05050A]" />
                    {/* New bottom-left gradient for balance */}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
                    {/* Noise overlay */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                </div>

                {/* 2. The "Interface" Container */}
                <div className="absolute inset-0 flex items-center justify-center perspective-[2000px]">
                    <motion.div
                        initial={{ rotateX: 20, rotateY: -20, opacity: 0, scale: 0.9 }}
                        animate={{ rotateX: 10, rotateY: -10, opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative w-[600px] h-[400px] transform-style-3d"
                    >

                        {/* COMPONENT A: The Main Dashboard Card (Back) */}
                        <div className="absolute inset-0 rounded-xl bg-neutral-900/50 border border-white/10 shadow-2xl overflow-hidden opacity-60 translate-z-[-50px] scale-95 blur-[1px] backdrop-blur-md">
                            <div className="h-full w-full bg-grid-white/[0.03]" />
                        </div>

                        {/* COMPONENT B: The "Active Project" Card (Middle) */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 right-0 w-[320px] rounded-xl bg-[#0A0A0A]/90 border border-white/10 shadow-[0_0_50px_-12px_rgba(124,58,237,0.3)] overflow-hidden z-20 backdrop-blur-xl"
                        >
                            {/* Header */}
                            <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                                <div className="h-2 w-2 rounded-full bg-green-500/50" />
                            </div>
                            {/* Content */}
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="h-2 w-20 bg-white/10 rounded-full mb-1.5" />
                                        <div className="h-1.5 w-12 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                    <div className="h-1.5 w-3/4 bg-white/5 rounded-full" />
                                </div>
                                <div className="flex -space-x-2 pt-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-6 w-6 rounded-full border-2 border-[#0A0A0A] bg-neutral-800" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* COMPONENT C: The "Live Feed" (Floating Left) */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="absolute bottom-10 -left-12 w-[280px] z-30"
                        >
                            <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Live Activity</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { title: "Design System v2.0", time: "Just now", color: "bg-purple-500" },
                                        { title: "Alex joined 'Q4 Goals'", time: "2m ago", color: "bg-blue-500" },
                                        { title: "New note published", time: "5m ago", color: "bg-emerald-500" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full ${item.color} shadow-lg shadow-${item.color}/50`} />
                                            <div className="flex-1">
                                                <p className="text-xs text-neutral-300 font-medium">{item.title}</p>
                                                <p className="text-[10px] text-neutral-600">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* COMPONENT D: The "Notification" */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.2, type: "spring" }}
                            className="absolute -top-6 -right-6 z-40 bg-neutral-800/90 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-xl flex items-center gap-3"
                        >
                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-sm shadow-green-500/20">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">All Systems Normal</p>
                                <p className="text-[10px] text-neutral-400">99.9% Uptime</p>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>

                {/* Louder Bottom Gradient Fade */}
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#05050A] via-[#05050A]/80 to-transparent pointer-events-none" />
            </div>

            {/* === LEFT COLUMN (Form Side) === */}
            <div className="relative order-2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:order-1 lg:px-24 overflow-hidden">

                {/* NEW: Vibrant background glows for the form side */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    {/* Blue glow top left */}
                    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-700/10 rounded-full blur-[150px] mix-blend-screen" />
                    {/* Purple glow bottom right */}
                    <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-700/10 rounded-full blur-[150px] mix-blend-screen" />
                </div>

                {/* Content Wrapper (z-10 to sit above glows) */}
                <div className="relative z-10">
                    {/* Back to Home */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute left-0 -top-16 lg:-left-6 lg:-top-24"
                    >
                        <Link
                            href="/"
                            className="group flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="w-full max-w-md mx-auto"
                    >
                        <div className="mb-10">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl"
                            >
                                Welcome back <br /> to the energy.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-lg text-neutral-400"
                            >
                                Sign in to connect with your team's momentum.
                            </motion.p>
                        </div>

                        {/* Premium Glass Login Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            // Increased border opacity slightly for better definition against new colorful bg
                            className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl transition-all hover:border-white/25 hover:bg-white/[0.07]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-50" />
                            {/* Colorful blob inside the card on hover */}
                            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-colors duration-700" />

                            {/* Button Container */}
                            <div className="relative z-10 space-y-6">
                                <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-neutral-800 to-neutral-800 hover:from-blue-500/50 hover:to-purple-500/50 transition-colors duration-500 group/btn">
                                    <Button
                                        onClick={handleLogin}
                                        className="relative h-14 w-full overflow-hidden rounded-xl border-none bg-neutral-900 text-base font-semibold text-white shadow-none transition-all hover:bg-neutral-800 focus:ring-2 focus:ring-purple-500/30"
                                    >
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/btn:animate-shimmer" />
                                        <span className="flex items-center gap-3 relative z-10">
                                            <svg className="h-5 w-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="#F25022" d="M1 1H10V10H1V1z" />
                                                <path fill="#00A4EF" d="M1 12H10V21H1V12z" />
                                                <path fill="#7FBA00" d="M12 1H21V10H12V1z" />
                                                <path fill="#FFB900" d="M12 12H21V21H12V12z" />
                                            </svg>
                                            Sign in with Microsoft
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* Footer - REMOVED Bank Grade Security */}
                            <div className="mt-8 flex items-center justify-center text-xs font-medium text-neutral-500">
                                <span className="flex items-center gap-2 transition-colors hover:text-neutral-400">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/80" />
                                    Enterprise SSO enabled
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}