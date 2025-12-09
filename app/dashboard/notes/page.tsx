import { TactileNoteCard } from "@/components/notes/tactile-note-card"
import { getNotesWithRelations } from "@/lib/mock-data"

// Define the type locally or import if shared (keeping local for now as it matches)
type DisplayNote = {
    id: string
    title: string
    recipient: string
    date: string
    status: string
}

function getData(): DisplayNote[] {
    const notes = getNotesWithRelations();
    return notes.map(note => ({
        id: note.id,
        // Allow longer content for the card view
        title: note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content,
        recipient: note.recipient?.name || 'Unknown',
        date: new Date(note.createdAt).toLocaleDateString(),
        status: note.status
    }))
}

export default async function Page() {
    const data = getData()

    return (
        <div className="min-h-screen p-8 relative overflow-hidden">

            <div className="relative z-10 container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="relative">
                        <h2 className="text-6xl font-extrabold text-slate-800 tracking-tight font-handwriting rotate-[-2deg] drop-shadow-sm">
                            My Notes
                        </h2>
                        {/* Underline scribble */}
                        <svg className="absolute -bottom-4 left-0 w-[120%] h-6 text-indigo-500 opacity-80" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00026 6.99997C38.5306 2.06733 133.279 -2.86591 199.5 5.50002" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Washi Tape Search Bar */}
                    <div className="relative rotate-1 max-w-sm w-full">
                        <div className="absolute inset-0 bg-yellow-100/80 transform skew-x-2 rounded-sm shadow-sm -z-10 border border-white/40" />
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white/40 skew-x-12 opacity-50" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white/40 skew-x-12 opacity-50" />

                        <input
                            type="text"
                            placeholder="Find a thought..."
                            className="w-full bg-transparent border-none px-4 py-2 font-handwriting text-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20 perspective-[1000px]">
                    {/* Add New Note Card - Always First */}
                    <TactileNoteCard variant="create" index={0} />

                    {data.map((note, idx) => (
                        <TactileNoteCard key={note.id} note={note} index={idx + 1} />
                    ))}
                </div>
            </div>
        </div>
    )
}
