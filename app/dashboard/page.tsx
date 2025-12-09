
import { StatsCards } from "@/components/dashboard/stats-cards"
import { NoteCard } from "@/components/dashboard/note-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { getNotesWithRelations } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
    const notes = getNotesWithRelations()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            </div>
            <StatsCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-4 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold tracking-tight mt-4">Recent Notes</h3>
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            author={{
                                name: note.author?.name || 'Unknown',
                                avatarUrl: note.author?.avatarUrl || '',
                            }}
                            content={note.content}
                            createdAt={note.createdAt}
                            recipientName={note.recipient?.name || 'Unknown'}
                        />
                    ))}
                </div>
                <div className="col-span-3 lg:col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
