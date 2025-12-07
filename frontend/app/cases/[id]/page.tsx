"use client"

import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { CaseDetailView } from "@/components/cases/case-detail-view"

export default function CaseDetailPage() {
  const params = useParams()
  const caseId = params.id as string

  return (
    <ProtectedRoute>
      <AppLayout>
        <CaseDetailView caseId={caseId} />
      </AppLayout>
    </ProtectedRoute>
  )
}
