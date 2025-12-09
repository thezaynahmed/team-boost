
import { auth } from "@/lib/auth"

export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})

export const config = {
    matcher: ["/dashboard/:path*"],
}
