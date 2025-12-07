"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { useOrganization } from "@/context/organization-context"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { organization } = useOrganization()

  // Allow rendering even if organization is not set - it will initialize on first load
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading authentication...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
