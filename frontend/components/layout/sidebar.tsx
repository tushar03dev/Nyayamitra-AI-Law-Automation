"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Grid,
  FolderOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Grid },
  { name: "Cases", href: "/cases", icon: FolderOpen },
  { name: "Hearings", href: "/hearings", icon: Calendar },
  { name: "Communication", href: "/communication", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const pathname = usePathname()

  return (
    <aside className={cn("bg-gray-900 text-white transition-all duration-300 flex flex-col", isOpen ? "w-64" : "w-20")}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {isOpen && <h1 className="text-2xl font-bold">LitigateIQ</h1>}
        <Button variant="ghost" size="sm" onClick={onToggle} className="text-gray-400 hover:text-white">
          {isOpen ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                  isActive && "bg-blue-600 text-white hover:bg-blue-700",
                )}
              >
                <Icon className="w-5 h-5" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
