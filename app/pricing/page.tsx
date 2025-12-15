"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Sparkles, Zap, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import SmoothScroll from "@/components/ui/SmoothScroll";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import MagneticButton from "@/components/ui/MagneticButton";

const plans = [
    {
        name: "Starter",
        description: "Perfect for small teams getting started with recognition",
        price: { monthly: 0, yearly: 0 },
        priceLabel: "Free",
        features: [
            "Up to 10 team members",
            "50 notes per month",
            "Basic analytics",
            "Public recognition wall",
            "Email notifications",
        ],
        cta: "Get Started",
        href: "/dashboard",
        popular: false,
        icon: Zap,
        gradient: "from-neutral-500 to-neutral-600",
        glowColor: "rgba(150, 150, 150, 0.3)",
    },
    {
        name: "Pro",
        description: "For growing teams that want unlimited recognition",
        price: { monthly: 12, yearly: 10 },
        priceLabel: null,
        features: [
            "Unlimited team members",
            "Unlimited notes",
            "Advanced analytics & insights",
            "Custom branding",
            "Priority support",
            "Slack & Teams integration",
            "Export reports",
        ],
        cta: "Start Free Trial",
        href: "/dashboard",
        popular: true,
        icon: Sparkles,
        gradient: "from-indigo-500 to-purple-500",
        glowColor: "rgba(139, 92, 246, 0.4)",
    },
    {
        name: "Enterprise",
        description: "For organizations requiring advanced security & support",
        price: { monthly: null, yearly: null },
        priceLabel: "Custom",
        features: [
            "Everything in Pro",
            "SSO / SAML authentication",
            "Dedicated account manager",
            "Custom integrations",
            "SLA guarantee",
            "On-premise deployment option",
            "Advanced security controls",
            "Audit logs",
        ],
        cta: "Contact Sales",
        href: "/contact",
        popular: false,
        icon: Building2,
        gradient: "from-cyan-500 to-blue-500",
        glowColor: "rgba(6, 182, 212, 0.3)",
    },
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
        show: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { type: "spring" as const, stiffness: 60, damping: 20 },
        },
    };

    return (
        <>
            <FloatingNavbar />
            <SmoothScroll>
                <main className="bg-neutral-950 min-h-screen text-white relative overflow-hidden">
                    {/* Top Spotlight (Ceiling Light) */}
                    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

                    {/* Global Noise */}
                    <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-[50] mix-blend-overlay" />

                    {/* Hero Section */}
                    <motion.section
                        ref={heroRef}
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="relative min-h-[60vh] w-full flex flex-col items-center justify-center pt-32 pb-40"
                    >
                        <BackgroundGrid />

                        <div className="container px-4 md:px-6 z-10 relative max-w-5xl mx-auto">
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col items-center text-center"
                            >
                                {/* Badge */}
                                <motion.div variants={item} className="mb-6">
                                    <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-sm font-medium text-indigo-300 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
                                        Simple, transparent pricing
                                    </span>
                                </motion.div>

                                {/* Headline */}
                                <motion.h1
                                    variants={item}
                                    className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]"
                                >
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-sm">
                                        Invest in your
                                    </span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 pb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                        team&apos;s culture.
                                    </span>
                                </motion.h1>

                                {/* Subtext */}
                                <motion.p
                                    variants={item}
                                    className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed tracking-tight"
                                >
                                    Start free, scale as you grow. No hidden fees, no surprises.
                                </motion.p>

                                {/* Billing Toggle */}
                                <motion.div
                                    variants={item}
                                    className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]"
                                >
                                    <button
                                        onClick={() => setBillingCycle("monthly")}
                                        className={cn(
                                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative",
                                            billingCycle === "monthly"
                                                ? "text-black"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        {billingCycle === "monthly" && (
                                            <motion.div
                                                layoutId="billing-toggle"
                                                className="absolute inset-0 bg-white rounded-full shadow-lg"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">Monthly</span>
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle("yearly")}
                                        className={cn(
                                            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 relative",
                                            billingCycle === "yearly"
                                                ? "text-black"
                                                : "text-neutral-400 hover:text-white"
                                        )}
                                    >
                                        {billingCycle === "yearly" && (
                                            <motion.div
                                                layoutId="billing-toggle"
                                                className="absolute inset-0 bg-white rounded-full shadow-lg"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            Yearly
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold shadow-sm">
                                                -17%
                                            </span>
                                        </span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Pricing Cards Section */}
                    {/* Fixed Spacing: Removed negative margin and added generous padding */}
                    <section className="relative w-full pb-32">
                        <div className="container px-4 md:px-6 z-10 relative max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                                {plans.map((plan, index) => (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{
                                            delay: index * 0.15,
                                            duration: 0.6,
                                            type: "spring" as const,
                                            stiffness: 50,
                                            damping: 20,
                                        }}
                                        onMouseEnter={() => setHoveredCard(plan.name)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className={cn(
                                            "relative group rounded-3xl transition-all duration-500",
                                            plan.popular ? "lg:-mt-12 lg:mb-0 z-10" : "z-0"
                                        )}
                                    >
                                        {/* Animated Border Gradient */}
                                        <div
                                            className={cn(
                                                "absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b",
                                                plan.gradient
                                            )}
                                        />

                                        {/* Most Popular 'Pulsing' Glow behind the badge area */}
                                        {plan.popular && (
                                            <div
                                                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
                                                style={{
                                                    background: plan.glowColor,
                                                }}
                                            />
                                        )}

                                        {/* Popular Badge */}
                                        {plan.popular && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
                                            >
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-indigo-500 blur-md opacity-50" />
                                                    <span className="relative px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-xl flex items-center gap-2 border border-white/20">
                                                        <Sparkles className="w-4 h-4 fill-white/20" />
                                                        Most Popular
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Card Content */}
                                        <div
                                            className={cn(
                                                "relative h-full rounded-3xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-8 flex flex-col overflow-hidden transition-all duration-500",
                                                plan.popular && "bg-neutral-900/95 border-indigo-500/30",
                                                hoveredCard === plan.name && !plan.popular && "border-white/20"
                                            )}
                                        >
                                            {/* Spotlight Gradient */}
                                            <div
                                                className={cn(
                                                    "absolute -top-[100px] -right-[100px] w-64 h-64 rounded-full blur-[80px] opacity-20 transition-all duration-1000 group-hover:opacity-40",
                                                    plan.popular ? "bg-indigo-600" : "bg-white"
                                                )}
                                            />

                                            {/* Icon */}
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-inner border border-white/10",
                                                    plan.gradient
                                                )}
                                            >
                                                <plan.icon className="w-7 h-7 text-white drop-shadow-md" />
                                            </motion.div>

                                            {/* Plan Name & Description */}
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                {plan.name}
                                            </h3>
                                            <p className="text-neutral-400 text-sm mb-8 leading-relaxed h-10">
                                                {plan.description}
                                            </p>

                                            {/* Price */}
                                            <div className="mb-8">
                                                {plan.priceLabel ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-bold text-white tracking-tight">
                                                            {plan.priceLabel}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-bold text-white tracking-tight">
                                                            ${plan.price[billingCycle]}
                                                        </span>
                                                        <span className="text-neutral-500 text-sm font-medium">
                                                            /user/month
                                                        </span>
                                                    </div>
                                                )}
                                                {billingCycle === "yearly" && plan.price.yearly !== null && plan.price.yearly > 0 && (
                                                    <p className="text-xs font-semibold text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                                        Billed annually (${plan.price.yearly * 12}/user)
                                                    </p>
                                                )}
                                                {/* Spacer for alignment if no yearly label */}
                                                {!(billingCycle === "yearly" && plan.price.yearly !== null && plan.price.yearly > 0) && (
                                                    <div className="h-[24px] mt-2" />
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                                            {/* Features */}
                                            <ul className="space-y-4 mb-10 flex-grow">
                                                {plan.features.map((feature, i) => (
                                                    <motion.li
                                                        key={feature}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.3 + i * 0.05 }}
                                                        className="flex items-start gap-3 group/feature"
                                                    >
                                                        <div
                                                            className={cn(
                                                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300",
                                                                plan.popular
                                                                    ? "bg-indigo-500/20 text-indigo-400 group-hover/feature:bg-indigo-500 group-hover/feature:text-white"
                                                                    : "bg-neutral-800 text-neutral-400 group-hover/feature:bg-white group-hover/feature:text-black"
                                                            )}
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                        <span className="text-neutral-300 text-sm leading-relaxed group-hover/feature:text-white transition-colors duration-300">
                                                            {feature}
                                                        </span>
                                                    </motion.li>
                                                ))}
                                            </ul>

                                            {/* CTA Button */}
                                            <Link href={plan.href} className="mt-auto">
                                                {plan.popular ? (
                                                    <MagneticButton className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_-10px_rgba(79,70,229,0.6)] transition-all">
                                                        <span className="font-bold text-lg">{plan.cta}</span>
                                                        <ArrowRight className="w-5 h-5" />
                                                    </MagneticButton>
                                                ) : (
                                                    <MagneticButton
                                                        variant="secondary"
                                                        className="w-full h-14 border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                                                    >
                                                        <span className="font-medium text-white">{plan.cta}</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </MagneticButton>
                                                )}
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Trust Section - Infinite Marquee */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 1 }}
                                className="mt-40 mb-32 relative w-full overflow-hidden"
                            >
                                <p className="text-center text-neutral-500 mb-12 text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-transparent via-neutral-500 to-transparent bg-clip-text text-transparent opacity-70">
                                    Powering High-Performance Teams At
                                </p>

                                {/* Gradient Masks */}
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

                                {/* Moving Track */}
                                <div className="flex gap-24 animate-marquee whitespace-nowrap items-center will-change-transform">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex gap-24 items-center">
                                            {["Microsoft", "Google", "Stripe", "Shopify", "Notion", "Linear", "Vercel", "OpenAI"].map((company) => (
                                                <span
                                                    key={company}
                                                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-white/10 hover:from-white hover:to-white/50 transition-all duration-500 cursor-default tracking-tighter"
                                                >
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* FAQ Teaser - Premium Holographic Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.3 }}
                                className="mt-20 w-full max-w-5xl mx-auto pb-32"
                            >
                                <div className="relative group rounded-[3rem] p-12 md:p-20 overflow-hidden border border-white/10 text-center">

                                    {/* Dynamic Background Mesh */}
                                    <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-2xl z-0" />

                                    {/* Animated Colorful Blobs */}
                                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow -translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow translate-x-1/2 translate-y-1/2" />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-medium text-neutral-300">Support Online</span>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-2xl">
                                            Still have questions?
                                        </h3>
                                        <p className="text-neutral-400 text-xl max-w-xl mb-12 leading-relaxed">
                                            Can&apos;t find what you&apos;re looking for? Our team fits your schedule, not the other way around.
                                        </p>

                                        <Link href="/contact">
                                            <MagneticButton
                                                className="h-16 px-10 bg-white text-black hover:scale-105 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_-10px_rgba(255,255,255,0.5)] border-none text-lg"
                                            >
                                                <span className="font-bold mr-2">Chat with Sales</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </MagneticButton>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Footer is handled globally in layout.tsx */}
                </main>
            </SmoothScroll>
        </>
    );
}
