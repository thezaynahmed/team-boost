
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card"
import { GalleryVerticalEnd } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Login to TeamBoost</CardTitle>
                    <CardDescription>
                        Welcome back! Please sign in to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        action={async () => {
                            "use server"
                            await signIn("microsoft-entra-id", { redirectTo: "/dashboard" })
                        }}
                    >
                        <Button className="w-full" type="submit">
                            Sign in with Microsoft
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
