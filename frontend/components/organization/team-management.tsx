"use client"

import { useState } from "react"
import { useOrganization } from "@/context/organization-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"
import type { User } from "@/types"
import { useToast } from "@/hooks/use-toast"

export function TeamManagement() {
  const { organization } = useOrganization()
  const [members, setMembers] = useState<User[]>([
    {
      id: "user-1",
      email: "senior@example.com",
      name: "Senior Lawyer",
      firstName: "Senior",
      lastName: "Lawyer",
      role: "lawyer",
      organizationId: organization?.id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-2",
      email: "junior@example.com",
      name: "Junior Associate",
      firstName: "Junior",
      lastName: "Associate",
      role: "junior_lawyer",
      organizationId: organization?.id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"lawyer" | "junior_lawyer" | "admin">("lawyer")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newMember: User = {
        id: `user-${Date.now()}`,
        email: newMemberEmail,
        name: newMemberEmail.split("@")[0],
        firstName: "",
        lastName: "",
        role: newMemberRole,
        organizationId: organization?.id || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setMembers([...members, newMember])
      setNewMemberEmail("")
      setNewMemberRole("lawyer")
      toast({
        title: "Success",
        description: "Team member added successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId))
    toast({
      title: "Success",
      description: "Team member removed",
    })
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      lawyer: "bg-blue-100 text-blue-800",
      junior_lawyer: "bg-purple-100 text-purple-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your legal team and their access levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newMemberRole} onValueChange={(value: any) => setNewMemberRole(value)}>
                <SelectTrigger id="role" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                  <SelectItem value="junior_lawyer">Junior Lawyer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddMember} disabled={loading} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getRoleColor(member.role)}>{member.role.replace("_", " ")}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
