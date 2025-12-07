"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-8">
          <DashboardOverview />
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
