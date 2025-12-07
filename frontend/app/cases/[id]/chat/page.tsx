"use client"

import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { CaseChatView } from "@/components/chat/case-chat-view"

export default function CaseChatPage() {
  const params = useParams()
  const caseId = params.id as string

  return (
    <ProtectedRoute>
      <AppLayout>
        <CaseChatView caseId={caseId} />
      </AppLayout>
    </ProtectedRoute>
  )
}
