"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Mail, Trash2, UserPlus } from "lucide-react"
import axiosInstance from "@/lib/axios-instance"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "lawyer" | "associate" | "paralegal"
  status: "active" | "inactive"
  joinedAt: string
}

export default function TeamsPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"lawyer" | "associate" | "paralegal">("associate")

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.get("/organization/members")
      setMembers(response.data)
    } catch (error) {
      console.error("Failed to fetch team members:", error)
      // Demo data fallback
      setMembers([
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.johnson@law.com",
          role: "admin",
          status: "active",
          joinedAt: "2024-01-01",
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "michael.chen@law.com",
          role: "lawyer",
          status: "active",
          joinedAt: "2024-01-15",
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          email: "emily.rodriguez@law.com",
          role: "associate",
          status: "active",
          joinedAt: "2024-02-01",
        },
        {
          id: "4",
          name: "James Park",
          email: "james.park@law.com",
          role: "paralegal",
          status: "inactive",
          joinedAt: "2024-01-20",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return

    try {
      await axiosInstance.post("/organization/members", {
        email: newMemberEmail,
        role: newMemberRole,
      })
      setNewMemberEmail("")
      fetchTeamMembers()
    } catch (error) {
      console.error("Failed to add member:", error)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await axiosInstance.delete(`/organization/members/${memberId}`)
      fetchTeamMembers()
    } catch (error) {
      console.error("Failed to remove member:", error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/20 text-primary"
      case "lawyer":
        return "bg-secondary/20 text-secondary"
      case "associate":
        return "bg-accent/20 text-accent"
      case "paralegal":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
                <p className="text-muted-foreground mt-1">Manage your legal team members and permissions</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Add Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Email Address</label>
                      <Input
                        type="email"
                        placeholder="member@law.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="mt-2 bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Role</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as any)}
                        className="w-full mt-2 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      >
                        <option value="associate">Associate</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="paralegal">Paralegal</option>
                      </select>
                    </div>
                    <Button
                      onClick={handleAddMember}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Add Member
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Members</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{members.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {members.filter((m) => m.status === "active").length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Lawyers</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {members.filter((m) => m.role === "lawyer" || m.role === "admin").length}
                    </p>
                  </div>
                  <Mail className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Support Staff</p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {members.filter((m) => m.role === "associate" || m.role === "paralegal").length}
                    </p>
                  </div>
                  <UserPlus className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members List */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-muted-foreground">Loading team members...</p>
              ) : members.length === 0 ? (
                <p className="text-muted-foreground">No team members found</p>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(member.role)}>{member.role.toUpperCase()}</Badge>
                        <Badge
                          variant="outline"
                          className={
                            member.status === "active" ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"
                          }
                        >
                          {member.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
