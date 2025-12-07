"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { CasesListView } from "@/components/cases/cases-list-view"

export default function CasesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <CasesListView />
      </AppLayout>
    </ProtectedRoute>
  )
}
