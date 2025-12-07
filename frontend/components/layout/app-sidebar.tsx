"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Briefcase, Calendar, MessageSquare, Users, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Briefcase, label: "Cases", href: "/cases" },
  { icon: Calendar, label: "Hearings", href: "/hearings" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Users, label: "Team", href: "/team" },
]

const settingsMenuItems = [{ icon: Settings, label: "Settings", href: "/settings" }]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <h1 className="text-xl font-bold text-primary">Nyayamitra</h1>
        <p className="text-xs text-muted-foreground">Legal Case Management</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn("rounded-lg mx-2", pathname === item.href && "bg-primary text-primary-foreground")}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-8 border-t pt-4">
          <SidebarMenu>
            {settingsMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild className="rounded-lg mx-2">
                  <Link href={item.href} className="flex items-center gap-3 text-muted-foreground">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
