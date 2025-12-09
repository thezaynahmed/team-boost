"use client"

import * as React from "react"
import { Edit, MoreVertical, Trash2, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Note {
    id: string
    title: string
    // Using 'content' or 'body' as requested. The page.tsx mapped it to 'title' which was content substring.
    // I'll accept 'body' for the full content if available, or just use what passed.
    // The interface in page.tsx had title, recipient, date, status.
    // I will make this component accept those.
    body?: string
    recipient: string
    date: string
    status: string
}

interface TactileNoteCardProps {
    note?: Note
    className?: string
    variant?: "default" | "create"
    index?: number // For animation delay
}

// Deterministic random helpers
const hashCode = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}

const getRotation = (id: string) => {
    const hash = hashCode(id)
    return (hash % 5) - 2
}

const getColor = (id: string) => {
    const colors = [
        "bg-[#fef9c3]", // Yellow
        "bg-[#dbeafe]", // Blue
        "bg-[#fce7f3]", // Pink
        "bg-[#dcfce7]", // Green
        "bg-[#f3e8ff]", // Purple
    ]
    const hash = hashCode(id)
    return colors[Math.abs(hash) % colors.length]
}

const getPinStyle = (id: string) => {
    // 0: Red Pin, 1: Blue Pin, 2: Scotch Tape, 3: Washi Tape
    const styles = ["pin-red", "pin-blue", "tape-clear", "tape-washi"]
    const hash = hashCode(id)
    return styles[Math.abs(hash) % styles.length]
}

export function TactileNoteCard({ note, className, variant = "default", index = 0 }: TactileNoteCardProps) {
    const [isHovered, setIsHovered] = React.useState(false)

    // Memoize randomness
    const uniqueId = note?.id || "new-note"
    const rotation = React.useMemo(() => variant === 'create' ? 0 : getRotation(uniqueId), [uniqueId, variant])
    const noteColor = React.useMemo(() => variant === 'create' ? "bg-white/80" : getColor(uniqueId), [uniqueId, variant])
    const pinStyle = React.useMemo(() => variant === 'create' ? "none" : getPinStyle(uniqueId), [uniqueId, variant])

    const animationDelay = `${index * 50}ms`

    if (variant === "create") {
        return (
            <div
                className={cn(
                    "group relative flex flex-col items-center justify-center p-6 transition-all duration-300 ease-out cursor-pointer",
                    "min-h-[280px] w-full rounded-sm border-4 border-dashed border-slate-300/60 bg-white/50 backdrop-blur-sm",
                    "hover:border-indigo-400/50 hover:bg-white/80 hover:scale-[1.02] hover:-rotate-1",
                    "animate-in fade-in zoom-in duration-500 fill-mode-backwards",
                    className
                )}
                style={{ animationDelay }}
            >
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                    <span className="text-4xl text-slate-400 group-hover:text-indigo-400 font-handwriting">+</span>
                </div>
                <h3 className="font-handwriting text-2xl text-slate-500 group-hover:text-indigo-500">
                    Write a new note
                </h3>
            </div>
        )
    }

    if (!note) return null

    return (
        <div
            className={cn(
                "group relative flex flex-col p-6 transition-all duration-300 ease-out",
                "min-h-[280px] w-full rounded-sm",
                noteColor,
                "shadow-md hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] hover:z-10",
                "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards",
                className
            )}
            style={{
                transform: `rotate(${rotation}deg)`,
                animationDelay,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Pin / Tape Graphics */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                {pinStyle === "pin-red" && (
                    <div className="h-4 w-4 rounded-full bg-red-500 shadow-md border border-white/20 ring-1 ring-black/10" />
                )}
                {pinStyle === "pin-blue" && (
                    <div className="h-4 w-4 rounded-full bg-blue-500 shadow-md border border-white/20 ring-1 ring-black/10" />
                )}
                {pinStyle === "tape-clear" && (
                    <div className="w-12 h-6 bg-white/30 backdrop-blur-[1px] -rotate-2 transform shadow-sm border-t border-b border-white/40" />
                )}
                {pinStyle === "tape-washi" && (
                    <div className="w-10 h-6 bg-yellow-200/80 -rotate-1 transform shadow-sm opacity-80"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}
                    />
                )}
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="text-2xl opacity-70 drop-shadow-sm">
                        {note.status === 'published' ? '📌' : '📝'}
                    </div>
                    <h3 className="font-sans font-bold text-lg text-slate-800/90 leading-tight">
                        {note.status === 'published' ? 'Details' : 'Draft'}
                    </h3>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4 text-slate-600" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="font-sans">
                        <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Body Content - Handwriting Font */}
            <div className="flex-grow font-handwriting text-2xl text-slate-800 leading-relaxed overflow-hidden drop-shadow-sm">
                {note.title}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-slate-400/20 flex items-end justify-between text-xs font-sans text-slate-600 relative">
                <div className="flex flex-col gap-1">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">To: {note.recipient}</span>
                    <span className="font-medium">{note.date}</span>
                </div>

                {/* Stamp Badge */}
                {note.status === 'published' && (
                    <div className="border-2 border-slate-800/20 text-slate-800/40 font-bold text-[10px] px-2 py-0.5 rounded-sm rotate-[-8deg] uppercase tracking-widest">
                        Sent
                    </div>
                )}
            </div>

            {/* Corner Curl */}
            <div
                className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none transition-all duration-300 group-hover:w-10 group-hover:h-10"
                style={{
                    background: 'linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.15) 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                }}
            />
        </div>
    )
}
