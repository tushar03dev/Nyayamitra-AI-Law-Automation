"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface OAuthButtonProps {
  provider: "google"
  mode: "login" | "signup"
  className?: string
}

export function OAuthButton({ provider, mode, className }: OAuthButtonProps) {
  const router = useRouter()

  const handleOAuthLogin = () => {
    localStorage.setItem("oauth-mode", mode)
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/${provider}`
  }

  const providerConfig = {
    google: {
      name: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 2.43-4.53 6.16-4.53z"
          />
        </svg>
      ),
      bgColor: "bg-white hover:bg-black",
      textColor: "text-gray-700 hover:text-white",
      borderColor: "border-gray-300 hover:border-black",
    },
  }

  const config = providerConfig[provider]
  const actionText = mode === "login" ? "Sign in" : "Sign up"

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full ${config.bgColor} ${config.textColor} ${config.borderColor} border shadow-sm transition-all duration-200 hover:scale-105 ${className}`}
      onClick={handleOAuthLogin}
    >
      <div className="flex items-center justify-center gap-3">
        {config.icon}
        <span className="font-medium">
          {actionText} with {config.name}
        </span>
      </div>
    </Button>
  )
}

export function OAuthSuccessHandler() {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const userData = urlParams.get("user")
    const error = urlParams.get("error")

    if (error) {
      router.replace("/login?error=" + encodeURIComponent(error))
      return
    }

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData))
        localStorage.setItem("token", token)
        localStorage.setItem("nyayamitra-user", JSON.stringify(user)) // Updated localStorage key from connectify-user to nyayamitra-user
        localStorage.removeItem("oauth-mode")
        router.replace("/")
      } catch (err) {
        router.replace("/login?error=invalid_user_data")
      }
    }
  }, [router])

  return null
}

export function OAuthButtonGroup({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="space-y-3">
      <OAuthButton provider="google" mode={mode} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>
    </div>
  )
}
