"use client"

import { useEffect, useState } from "react"
import { useCase } from "@/context/case-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"

interface Participant {
  id: string
  userId: string
  userName: string
  role: string
  accessLevel: string
  status?: "online" | "offline"
}

export default function CaseParticipantsSidebar({ caseId }: { caseId: string }) {
  const { getCaseParticipants } = useCase()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true)
      try {
        const data = await getCaseParticipants(caseId)
        setParticipants(data)
      } catch (err) {
        console.error("Failed to fetch participants")
      } finally {
        setLoading(false)
      }
    }

    fetchParticipants()
    // Poll for status updates every 5 seconds
    const interval = setInterval(fetchParticipants, 5000)
    return () => clearInterval(interval)
  }, [caseId, getCaseParticipants])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "lawyer":
        return "bg-purple-100 text-purple-800"
      case "junior":
        return "bg-blue-100 text-blue-800"
      case "client":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="p-4 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-900">Team Members</h3>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
        ) : participants.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No participants yet</p>
        ) : (
          participants.map((participant) => (
            <div key={participant.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className={`w-3 h-3 rounded-full mt-1.5 ${participant.status === "online" ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{participant.userName}</p>
                <Badge className={`mt-1 text-xs ${getRoleBadgeColor(participant.role)}`}>{participant.role}</Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
