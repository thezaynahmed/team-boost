"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Users,
    FileText,
    Home,
    Settings
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// Sample data for the sidebar
const data = {
    user: {
        name: "Alice Chen",
        email: "alice@teamboost.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    teams: [
        {
            name: "TeamBoost",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Overview",
            url: "/dashboard",
            icon: Home,
            isActive: true,
        },
        {
            title: "My Notes",
            url: "/dashboard/notes",
            icon: FileText,
        },
        {
            title: "Team",
            url: "/dashboard/team",
            icon: Users,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: Bot,
        },
        {
            title: "Feedback",
            url: "#",
            icon: SquareTerminal,
        }
    ]
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: { name: string; email: string; avatar: string } }) {
    return (
        <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user || data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
