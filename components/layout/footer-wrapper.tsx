
"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";

export function FooterWrapper() {
    const pathname = usePathname();

    // Don't show footer on dashboard pages
    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return <SiteFooter />;
}
