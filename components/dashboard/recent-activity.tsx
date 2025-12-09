
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function RecentActivity() {
    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                    <p className="text-xs text-muted-foreground">
                        Replied to your note "Quarterly Update"
                    </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">Just now</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jackson" alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Jackson Lee</p>
                    <p className="text-xs text-muted-foreground">
                        Liked your note "Project Launch"
                    </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">2m ago</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella" alt="Avatar" />
                    <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                    <p className="text-xs text-muted-foreground">
                        Sent you a new note
                    </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">1h ago</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=William" alt="Avatar" />
                    <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">William Kim</p>
                    <p className="text-xs text-muted-foreground">
                        Archived the "Old Specs" note
                    </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">3h ago</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia" alt="Avatar" />
                    <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Sofia Davis</p>
                    <p className="text-xs text-muted-foreground">
                        Replied to "Lunch?"
                    </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">5h ago</div>
            </div>
        </div>
    )
}
