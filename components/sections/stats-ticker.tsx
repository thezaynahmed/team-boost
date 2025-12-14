"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Users, FileText, Zap, Hexagon, Circle, Triangle } from "lucide-react";

// --- Types ---
interface StatItem {
    label: string;
    value: number;
    suffix: string;
    icon: React.ComponentType<any>;
}

const stats: StatItem[] = [
    { label: "Total Notes", value: 10420, suffix: "", icon: FileText },
    { label: "Active Teams", value: 500, suffix: "+", icon: Users },
    { label: "Morale Boosted", value: 100, suffix: "%", icon: Zap },
];

const companies = [
    "Acme Corp", "Globex", "Initech", "Soylent", "Umbrella", "Stark Ind", "Massive Dynamic", "Cyberdyne",
    "Wayne Ent", "Oscorp", "Tyrell", "Aperture", "Black Mesa"
];

// --- Components ---

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-20%" });
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const rounded = useTransform(spring, (latest) => Math.floor(latest).toLocaleString());

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, value, spring]);

    return (
        <span ref={ref} className="tabular-nums font-mono text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-colors duration-500 overflow-hidden"
        >
            {/* Hover Gradient Border Effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 mb-4 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-6 h-6 text-zinc-300" />
            </div>

            <Counter value={stat.value} suffix={stat.suffix} />

            <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">
                {stat.label}
            </p>
        </motion.div>
    );
}

function OrbitingBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Central glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px]" />

            {/* Orbiting Elements */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 p-2 bg-zinc-950 border border-white/10 rounded-full">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                </div>
            </motion.div>

            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full border-dashed opacity-50"
            />

            {/* Floating Particles */}
            <Particles />
        </div>
    );
}

function Particles() {
    const [particles, setParticles] = useState<Array<{ width: number, height: number, top: number, left: number, duration: number, delay: number }>>([]);

    useEffect(() => {
        const newParticles = [...Array(5)].map(() => ({
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            top: Math.random() * 100,
            left: Math.random() * 100,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/10 rounded-full blur-[1px]"
                    style={{
                        width: p.width,
                        height: p.height,
                        top: `${p.top}%`,
                        left: `${p.left}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}

function Marquee() {
    return (
        <div className="relative flex overflow-hidden w-full mask-linear-fade">
            <div className="flex animate-marquee whitespace-nowrap py-4">
                {[...companies, ...companies, ...companies].map((company, i) => (
                    <span
                        key={i}
                        className="mx-8 text-lg font-semibold text-zinc-700 hover:text-white transition-colors cursor-default select-none"
                    >
                        {company}
                    </span>
                ))}
            </div>
            <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap py-4">
                {[...companies, ...companies, ...companies].map((company, i) => (
                    <span
                        key={i}
                        className="mx-8 text-lg font-semibold text-zinc-700 hover:text-white transition-colors cursor-default select-none"
                    >
                        {company}
                    </span>
                ))}
            </div>

            {/* Gradient Masks for Marquee fade */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />
        </div>
    );
}

export default function StatsTicker() {
    return (
        <section className="relative py-24 bg-neutral-950 overflow-hidden">
            <OrbitingBackground />

            <div className="container px-4 md:px-6 mx-auto relative z-10">

                {/* Stats Bento/Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {stats.map((stat, i) => (
                        <StatCard key={i} stat={stat} index={i} />
                    ))}
                </div>

                {/* Social Proof Marquee */}
                <div className="flex flex-col items-center space-y-8">
                    <h4 className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
                        Trusted by 500+ Engineering Teams
                    </h4>
                    <Marquee />
                </div>

            </div>

            {/* Custom Styles for ticker animation since Tailwind config might not have it */}
            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 50s linear infinite;
        }
      `}</style>
        </section>
    );
}
