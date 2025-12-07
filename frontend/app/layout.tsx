import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { OrganizationProvider } from "@/context/organization-context"
import { CaseProvider } from "@/context/case-context"
import { ChatProvider } from "@/context/chat-context"
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Nyayamitra_old - Legal Case Management",
  description: "Nyayamitra_old: Intelligent legal case management platform for modern law firms",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <OrganizationProvider>
            <CaseProvider>
              <ChatProvider>
                {children}
                <Toaster />
              </ChatProvider>
            </CaseProvider>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
