
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MessageSquare, ThumbsUp } from "lucide-react"

interface NoteCardProps {
    author: {
        name: string
        avatarUrl: string
    }
    content: string
    createdAt: string
    recipientName: string
}

export function NoteCard({ author, content, createdAt, recipientName }: NoteCardProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    })

    return (
        <Card className="w-full transition-all hover:-translate-y-1 hover:shadow-md border-border/60">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4 pb-2">
                <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={author.avatarUrl} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="text-sm font-medium leading-none">
                        {author.name} <span className="text-muted-foreground font-normal">to</span> {recipientName}
                    </div>
                    <p className="text-xs text-muted-foreground">{formattedDate}</p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {content}
                </p>
            </CardContent>
            <CardFooter className="p-2 flex gap-1 border-t bg-muted/20">
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">Reply</span>
                </Button>
            </CardFooter>
        </Card>
    )
}
