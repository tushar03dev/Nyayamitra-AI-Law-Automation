"use client"

import { useEffect } from "react"
import { useCase } from "@/context/case-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Share2 } from "lucide-react"
import CaseParticipants from "./case-participants"
import CaseDocuments from "./case-documents"
import CaseTimeline from "./case-timeline"

export default function CaseDetail({ caseId }: { caseId: string }) {
  const { selectedCase, loading, fetchCaseById } = useCase()

  useEffect(() => {
    fetchCaseById(caseId)
  }, [caseId, fetchCaseById])

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!selectedCase) {
    return <div className="text-center py-12 text-gray-500">Case not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{selectedCase.title}</h1>
          <p className="text-gray-600 mt-2">Case #{selectedCase.caseNumber}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      {/* Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <Badge className={getStatusColor(selectedCase.status)}>{selectedCase.status}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Priority</p>
            <Badge variant="outline">{selectedCase.priority}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Clients</p>
            <p className="text-sm font-semibold">{selectedCase.clientNames.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Next Hearing</p>
            <p className="text-sm font-semibold">
              {selectedCase.nextHearingDate ? new Date(selectedCase.nextHearingDate).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </Card>

      {/* Detailed Info */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedCase.description}</p>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Clients</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedCase.clientNames.map((client, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <CaseParticipants caseId={selectedCase.id} />
        </TabsContent>

        <TabsContent value="documents">
          <CaseDocuments caseId={selectedCase.id} />
        </TabsContent>

        <TabsContent value="timeline">
          <CaseTimeline caseId={selectedCase.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
