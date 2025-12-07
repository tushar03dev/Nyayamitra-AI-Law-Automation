"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { HearingsCalendarView } from "@/components/hearings/hearings-calendar-view"

export default function HearingsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <HearingsCalendarView />
      </AppLayout>
    </ProtectedRoute>
  )
}
