"use client";

import Link from "next/link";
import { Zap, Twitter, Github, Linkedin, Disc } from "lucide-react";

const footerLinks = {
    product: [
        { name: "Features", href: "#" },
        { name: "Public Wall", href: "/public" },
        { name: "Changelog", href: "#" },
        { name: "Docs", href: "#" },
    ],
    company: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#" },
    ],
    legal: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Cookies", href: "#" },
    ],
};

export function SiteFooter() {
    return (
        <footer className="relative bg-black pt-20 pb-10 overflow-hidden border-t border-white/5">
            {/* Background Watermark */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none select-none z-0">
                <h1 className="text-[18vw] font-bold leading-none text-white/[0.03] tracking-tighter whitespace-nowrap">
                    TeamBoost
                </h1>
            </div>

            <div className="container px-4 md:px-6 z-10 relative max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="rounded-lg bg-indigo-500/20 p-1 group-hover:bg-indigo-500/30 transition-colors">
                                <Zap className="h-5 w-5 text-indigo-400 fill-current" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">TeamBoost</span>
                        </Link>
                        <p className="text-neutral-400/80 text-sm leading-relaxed max-w-xs">
                            Making work fun again. The digital gratitude wall for high-performing, culture-focused teams.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Product</h3>
                        {footerLinks.product.map((link) => (
                            <Link key={link.name} href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Company</h3>
                        {footerLinks.company.map((link) => (
                            <Link key={link.name} href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Legal</h3>
                        {footerLinks.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-neutral-400">All Systems Normal</span>
                    </div>

                    <div className="flex text-xs text-neutral-500">
                        © {new Date().getFullYear()} TeamBoost Inc. All rights reserved.
                    </div>

                    <div className="flex gap-4">
                        <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
                            <Twitter className="w-4 h-4" />
                        </Link>
                        <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
