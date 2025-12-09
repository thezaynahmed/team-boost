"use client"

import { useEffect } from "react"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

export function AppInsights() {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING) {
            const appInsights = new ApplicationInsights({
                config: {
                    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,
                    enableAutoRouteTracking: true, // Automatically track route changes
                },
            })
            appInsights.loadAppInsights()
            appInsights.trackPageView()
        }
    }, [])

    return null
}
