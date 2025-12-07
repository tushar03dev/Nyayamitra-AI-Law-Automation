"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import type { CaseParticipant } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface CaseParticipantsTabProps {
  caseId: string
}

export function CaseParticipantsTab({ caseId }: CaseParticipantsTabProps) {
  const [participants, setParticipants] = useState<CaseParticipant[]>([
    {
      id: "p1",
      caseId,
      userId: "u1",
      userName: "Senior Lawyer",
      role: "lawyer",
      accessLevel: "admin",
    },
    {
      id: "p2",
      caseId,
      userId: "u2",
      userName: "Junior Associate",
      role: "junior",
      accessLevel: "edit",
    },
  ])
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"lawyer" | "junior" | "client">("junior")
  const [newAccessLevel, setNewAccessLevel] = useState<"view" | "edit" | "admin">("edit")
  const { toast } = useToast()

  const handleAddParticipant = () => {
    if (!newUserEmail) {
      toast({
        title: "Error",
        description: "Please enter an email",
        variant: "destructive",
      })
      return
    }

    const newParticipant: CaseParticipant = {
      id: `p-${Date.now()}`,
      caseId,
      userId: `u-${Date.now()}`,
      userName: newUserEmail.split("@")[0],
      role: newUserRole,
      accessLevel: newAccessLevel,
    }

    setParticipants([...participants, newParticipant])
    setNewUserEmail("")
    setNewUserRole("junior")
    setNewAccessLevel("edit")
    toast({ title: "Success", description: "Participant added" })
  }

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id))
    toast({ title: "Success", description: "Participant removed" })
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      lawyer: "bg-blue-100 text-blue-800",
      junior: "bg-purple-100 text-purple-800",
      client: "bg-green-100 text-green-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
          <CardDescription>Invite lawyers, juniors, or clients to this case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Email address" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
            <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lawyer">Lawyer</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newAccessLevel} onValueChange={(value: any) => setNewAccessLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddParticipant} className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {participant.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{participant.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.role} • {participant.accessLevel} access
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(participant.role)}>{participant.role}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No participants yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
