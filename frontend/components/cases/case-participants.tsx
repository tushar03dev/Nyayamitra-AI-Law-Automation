"use client"

import { useEffect, useState } from "react"
import { useCase } from "@/context/case-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { UserPlus, X } from "lucide-react"

interface CaseParticipant {
  id: string
  userId: string
  userName: string
  role: string
  accessLevel: string
}

export default function CaseParticipants({ caseId }: { caseId: string }) {
  const { getCaseParticipants, addCaseParticipant, removeParticipant } = useCase()
  const [participants, setParticipants] = useState<CaseParticipant[]>([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("lawyer")

  useEffect(() => {
    fetchParticipants()
  }, [caseId])

  const fetchParticipants = async () => {
    try {
      const data = await getCaseParticipants(caseId)
      setParticipants(data)
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch participants", variant: "destructive" })
    }
  }

  const handleAddParticipant = async () => {
    if (!email) return
    setLoading(true)
    try {
      await addCaseParticipant(caseId, email, role)
      setEmail("")
      toast({ title: "Success", description: "Participant added" })
      fetchParticipants()
    } catch (err) {
      toast({ title: "Error", description: "Failed to add participant", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId: string) => {
    try {
      await removeParticipant(caseId, userId)
      setParticipants(participants.filter((p) => p.userId !== userId))
      toast({ title: "Success", description: "Participant removed" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove participant", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Participant</h3>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="team member email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lawyer">Lawyer</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="observer">Observer</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddParticipant} disabled={loading || !email} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Case Team</h3>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{participant.userName}</p>
                <p className="text-sm text-gray-600">{participant.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(participant.userId)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
