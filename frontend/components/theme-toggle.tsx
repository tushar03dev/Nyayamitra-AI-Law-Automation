"use client"

import { Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always enforce dark theme
    localStorage.setItem("theme", "dark")
    document.documentElement.classList.add("dark")
  }, [])

  if (!mounted) return null

  return (
    <Button variant="ghost" size="icon" className="rounded-full cursor-default">
      <Moon className="h-5 w-5" />
    </Button>
  )
}
