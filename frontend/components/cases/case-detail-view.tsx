"use client"

import { useEffect, useState } from "react"
import { useCase } from "@/context/case-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CaseParticipantsTab } from "@/components/cases/case-participants-tab"
import { CaseDocumentsTab } from "@/components/cases/case-documents-tab"
import { CaseTimelineTab } from "@/components/cases/case-timeline-tab"
import { Calendar, Users, FileText, MessageSquare, Edit } from "lucide-react"
import type { Case } from "@/types"

interface CaseDetailViewProps {
  caseId: string
}

export function CaseDetailView({ caseId }: CaseDetailViewProps) {
  const { selectedCase, fetchCaseById, loading } = useCase()
  const [case_, setCase] = useState<Case | null>(null)

  useEffect(() => {
    fetchCaseById(caseId)
  }, [caseId])

  useEffect(() => {
    setCase(selectedCase)
  }, [selectedCase])

  if (loading || !case_) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      ongoing: "bg-yellow-100 text-yellow-800",
      closed: "bg-green-100 text-green-800",
      on_hold: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-50 text-green-700",
      medium: "bg-yellow-50 text-yellow-700",
      high: "bg-orange-50 text-orange-700",
      urgent: "bg-red-50 text-red-700",
    }
    return colors[priority] || "bg-gray-50 text-gray-700"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{case_.title}</h1>
          <p className="text-muted-foreground mt-2">{case_.caseNumber}</p>
        </div>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Case
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(case_.status)}>{case_.status.replace("_", " ")}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={getPriorityColor(case_.priority)}>
              {case_.priority}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Next Hearing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {case_.nextHearingDate ? new Date(case_.nextHearingDate).toLocaleDateString() : "Not scheduled"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{new Date(case_.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {case_.description && (
        <Card>
          <CardHeader>
            <CardTitle>Case Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{case_.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4">
          <CaseParticipantsTab caseId={caseId} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <CaseDocumentsTab caseId={caseId} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <CaseTimelineTab caseId={caseId} />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Chat feature will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
