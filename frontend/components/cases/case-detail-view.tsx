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
        <Skeleton className="h-32 w-full bg-muted" />
        <Skeleton className="h-96 w-full bg-muted" />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-primary/20 text-primary",
      ongoing: "bg-accent/20 text-accent",
      closed: "bg-green-500/20 text-green-300",
      on_hold: "bg-muted/40 text-muted-foreground",
    }
    return colors[status] || "bg-muted/40 text-muted-foreground"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-500/20 text-green-300",
      medium: "bg-accent/20 text-accent",
      high: "bg-secondary/20 text-secondary",
      urgent: "bg-red-500/20 text-red-300",
    }
    return colors[priority] || "bg-muted/40 text-muted-foreground"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{case_.title}</h1>
          <p className="text-muted-foreground mt-2">{case_.caseNumber}</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Edit className="h-4 w-4" />
          Edit Case
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(case_.status)}>{case_.status.replace("_", " ").toUpperCase()}</Badge>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={getPriorityColor(case_.priority)}>
              {case_.priority.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Hearing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">
              {case_.nextHearingDate ? new Date(case_.nextHearingDate).toLocaleDateString() : "Not scheduled"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">{new Date(case_.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {case_.description && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Case Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{case_.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card border-border">
          <TabsTrigger
            value="participants"
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Case Discussion</CardTitle>
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
