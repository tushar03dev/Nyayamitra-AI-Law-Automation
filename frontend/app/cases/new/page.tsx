"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { CaseFormContainer } from "@/components/cases/case-form-container"

export default function NewCasePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <CaseFormContainer />
      </AppLayout>
    </ProtectedRoute>
  )
}
