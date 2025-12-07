"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Users, MessageSquare, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "case_updated",
    title: "Case Status Updated",
    description: "Smith v. Corporation - Status changed to Ongoing",
    time: "2 hours ago",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "document_added",
    title: "Document Added",
    description: "Final arguments document uploaded to Johnson v. State",
    time: "4 hours ago",
    icon: FileText,
  },
  {
    id: 3,
    type: "team_added",
    title: "Team Member Added",
    description: "Senior Associate Sarah joined case Brown v. Company",
    time: "1 day ago",
    icon: Users,
  },
  {
    id: 4,
    type: "message",
    title: "New Messages",
    description: "5 new messages in Taylor v. Corporation chat",
    time: "2 days ago",
    icon: MessageSquare,
  },
]

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, idx) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex gap-4">
                <div className="relative pt-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {idx !== activities.length - 1 && <div className="absolute top-10 left-5 w-px h-16 bg-border"></div>}
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-semibold text-sm">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
