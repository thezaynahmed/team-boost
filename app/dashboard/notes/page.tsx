"use client";

import Masonry from "react-masonry-css";
import TactileNoteCard from "@/components/ui/TactileNoteCard";
import { getNotesWithRelations } from "@/lib/mock-data";

// Define the type locally or import if shared (keeping local for now as it matches)
type DisplayNote = {
    id: string
    title: string
    recipient: string
    date: string
    status: string
    content: string
    author: string
    color?: "blue" | "purple" | "neutral"
}

function getData(): DisplayNote[] {
    const notes = getNotesWithRelations();
    return notes.map((note, i) => ({
        id: note.id,
        title: note.content.length > 50 ? note.content.substring(0, 50) + '...' : note.content,
        content: note.content,
        author: note.author?.name || 'Unknown',
        recipient: note.recipient?.name || 'Unknown',
        date: new Date(note.createdAt).toLocaleDateString(),
        status: note.status,
        color: i % 3 === 0 ? "blue" : i % 3 === 1 ? "purple" : "neutral",
    }))
}

const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1000: 2,
    600: 1
};

export default function Page() {
    const data = getData()

    return (
        <div className="min-h-screen p-8 relative overflow-hidden bg-neutral-950">
            {/* Background noise to match Landing */}
            <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-[0] mix-blend-overlay" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none z-[-1]" />

            <div className="relative z-10 container mx-auto">
                <header className="mb-12">
                    <h2 className="text-4xl font-bold tracking-tighter text-white mb-2">My Notes</h2>
                    <p className="text-neutral-400">All your posted appreciation in one place.</p>
                </header>

                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto -ml-6"
                    columnClassName="pl-6 bg-clip-padding"
                >
                    {data.map((note, idx) => (
                        <div key={note.id} className="mb-6">
                            <TactileNoteCard
                                content={note.content}
                                author={`To: ${note.recipient}`}
                                color={note.color}
                                className={idx % 2 === 0 ? "rotate-1" : "-rotate-1"}
                            />
                        </div>
                    ))}
                </Masonry>
            </div>
        </div>
    )
}
