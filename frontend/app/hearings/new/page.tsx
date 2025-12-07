"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import HearingForm from "@/components/hearings/hearing-form"

export default function NewHearingPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <HearingForm />
      </div>
    </ProtectedRoute>
  )
}
