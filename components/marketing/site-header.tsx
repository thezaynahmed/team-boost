"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Public Wall", href: "/public" },
    { name: "Pricing", href: "/#pricing" },
];

export function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="rounded-lg bg-indigo-500/20 p-1 group-hover:bg-indigo-500/30 transition-colors"
                    >
                        <Zap className="h-5 w-5 text-indigo-400 fill-current" />
                    </motion.div>
                    <span className="text-lg font-bold tracking-tight text-white">TeamBoost</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium text-muted-foreground hover:text-white transition-colors relative group",
                                pathname === link.href && "text-white"
                            )}
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/get-started">
                        <Button className="bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)] border border-transparent font-medium rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Nav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-white/70 hover:text-white">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-neutral-950/95 backdrop-blur-2xl border-white/10 w-full sm:w-[350px]">
                        <nav className="flex flex-col gap-6 mt-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-2xl font-medium text-white/80 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/get-started">
                                    <Button className="w-full bg-white text-black hover:bg-neutral-200">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
