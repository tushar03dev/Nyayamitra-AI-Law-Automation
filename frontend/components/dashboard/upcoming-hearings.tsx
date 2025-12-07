"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import type { Hearing } from "@/types"

export function UpcomingHearings() {
  const [hearings, setHearings] = useState<Hearing[]>([
    {
      id: "h1",
      caseId: "case-1",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "10:00 AM",
      location: "Court Room 3, District Court",
      judge: "Hon. Justice Smith",
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
    {
      id: "h2",
      caseId: "case-2",
      date: new Date(Date.now() + 172800000).toISOString(),
      time: "2:00 PM",
      location: "Court Room 1, High Court",
      judge: "Hon. Justice Johnson",
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Hearings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hearings.length > 0 ? (
          hearings.map((hearing) => (
            <div key={hearing.id} className="border rounded-lg p-4 hover:bg-accent/50 transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">Case {hearing.caseId}</h3>
                <Badge>Scheduled</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(hearing.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {hearing.time}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {hearing.location}
                </div>
                {hearing.judge && (
                  <div className="text-muted-foreground">
                    <span className="font-medium">Judge:</span> {hearing.judge}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No upcoming hearings</div>
        )}
      </CardContent>
    </Card>
  )
}
