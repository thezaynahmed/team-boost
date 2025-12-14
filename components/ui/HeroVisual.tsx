"use client";

import { motion } from "framer-motion";
import { MessageSquare, Heart, TrendingUp } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

export default function HeroVisual() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 0 }}
            animate={{ opacity: 1, y: 0, rotateX: 12 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
            className="relative w-full max-w-5xl mx-auto -mb-32 md:-mb-20 px-4"
        >
            <div
                className="relative w-full bg-neutral-900/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/20 backdrop-blur-xl transform md:rotate-x-12 transition-transform duration-700 group"
            >
                <BorderBeam size={250} duration={12} delay={9} borderWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Always visible beam for the 'high-end' feel, or toggle on hover. Let's make it always visible but subtle, or just use it as requested. User said "Add a Border Beam effect". */}
                <BorderBeam size={300} duration={20} delay={0} borderWidth={1.5} colorFrom="#6366f1" colorTo="#a855f7" />

                {/* Mock Header */}
                <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="ml-4 w-64 h-2 bg-white/5 rounded-full" />
                </div>

                {/* Mock Content */}
                <div className="p-6 grid grid-cols-12 gap-6 h-[400px]">
                    {/* Sidebar */}
                    <div className="col-span-3 border-r border-white/10 pr-6 space-y-4 hidden md:block">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-white/5 rounded-full w-full opacity-60" />
                        ))}
                    </div>

                    {/* Main Area */}
                    <div className="col-span-12 md:col-span-9 space-y-6">
                        <div className="flex justify-between items-center mb-8">
                            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
                            <div className="h-8 w-24 bg-indigo-500/20 rounded-lg" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: MessageSquare, label: "Notes Sent", value: "1,240" },
                                { icon: Heart, label: "Reactions", value: "8.5k" },
                                { icon: TrendingUp, label: "Morale", value: "+12%" },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-2">
                                    <stat.icon className="w-5 h-5 text-indigo-400" />
                                    <div className="h-4 w-12 bg-white/10 rounded-full" />
                                    <div className="text-xl font-bold text-white/80">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mt-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/5" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Glow Underneath */}
                <div className="absolute -bottom-20 left-4 right-4 h-20 bg-indigo-500/30 blur-[100px] z-[-1]" />
            </div>
        </motion.div>
    );
}
