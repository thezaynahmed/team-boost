
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, Heart } from "lucide-react";

const footerLinks = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "Public Wall", href: "/public" },
            { name: "Pricing", href: "/pricing" },
            { name: "Changelog", href: "/changelog" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
            { name: "Security", href: "/security" },
        ],
    },
];

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
    <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10"
    >
        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
    </Link>
);

export function SiteFooter() {
    return (
        <footer className="relative w-full bg-black border-t border-white/10 pt-20 pb-10 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                                T
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                                TeamBoost
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                            Empowering teams to achieve peak performance through synchronized collaboration and intuitive workflows. Build better, together.
                        </p>
                        <div className="flex items-center gap-3">
                            <SocialLink href="https://twitter.com" icon={Twitter} />
                            <SocialLink href="https://github.com" icon={Github} />
                            <SocialLink href="https://linkedin.com" icon={Linkedin} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="lg:col-span-1">
                            <h3 className="font-semibold text-white mb-4">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-zinc-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter / CTA */}
                    <div className="lg:col-span-1 lg:col-start-6">
                        <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
                        <p className="text-xs text-zinc-500 mb-4">
                            Join our newsletter for the latest updates and tips.
                        </p>
                        <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600"
                            />
                            <button className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-500 text-xs">
                        © {new Date().getFullYear()} TeamBoost Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-zinc-600 text-xs text-center md:text-right">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-red-500 animate-pulse fill-red-500/50" />
                        <span>by <Link href="https://zainahmed.net" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-white">Zain Ahmed</Link> in Mississauga, Canada</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
