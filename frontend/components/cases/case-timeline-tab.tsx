"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from "lucide-react"

interface TimelineEvent {
  id: string
  type: "hearing" | "document" | "participant" | "status"
  title: string
  description: string
  date: string
  icon: typeof CheckCircle
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "status",
    title: "Case Status Changed",
    description: "Status updated from Open to Ongoing",
    date: new Date().toISOString(),
    icon: CheckCircle,
  },
  {
    id: "2",
    type: "hearing",
    title: "Hearing Scheduled",
    description: "Pre-trial hearing scheduled for next month",
    date: new Date(Date.now() - 86400000).toISOString(),
    icon: Clock,
  },
  {
    id: "3",
    type: "document",
    title: "Document Uploaded",
    description: "Case summary document added",
    date: new Date(Date.now() - 172800000).toISOString(),
    icon: CheckCircle,
  },
]

export function CaseTimelineTab({ caseId }: { caseId: string }) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hearing: "bg-blue-100 text-blue-800",
      document: "bg-green-100 text-green-800",
      participant: "bg-purple-100 text-purple-800",
      status: "bg-yellow-100 text-yellow-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon
            return (
              <div key={event.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="pt-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{event.title}</p>
                    <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(event.date).toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
