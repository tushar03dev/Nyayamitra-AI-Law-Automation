"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axios-instance"
import { MoreVertical, Trash2, Edit2, UserPlus } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "lawyer" | "junior_lawyer"
  status: "active" | "invited" | "inactive"
}

export default function MemberManagement() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("lawyer")

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/organizations/members")
      setMembers(response.data)
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch team members", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) return
    try {
      await axiosInstance.post("/organizations/members/invite", {
        email: inviteEmail,
        role: inviteRole,
      })
      setInviteEmail("")
      toast({ title: "Success", description: "Invitation sent" })
      fetchMembers()
    } catch (err) {
      toast({ title: "Error", description: "Failed to send invitation", variant: "destructive" })
    }
  }

  const handleRemove = async (memberId: string) => {
    try {
      await axiosInstance.delete(`/organizations/members/${memberId}`)
      setMembers(members.filter((m) => m.id !== memberId))
      toast({ title: "Success", description: "Member removed" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" })
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await axiosInstance.put(`/organizations/members/${memberId}`, { role: newRole })
      setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole as any } : m)))
      toast({ title: "Success", description: "Role updated" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "lawyer":
        return "bg-blue-100 text-blue-800"
      case "junior_lawyer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "invited":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Invite Team Member</h3>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="team member email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="lawyer">Lawyer</option>
            <option value="junior_lawyer">Junior Lawyer</option>
          </select>
          <Button onClick={handleInvite} disabled={!inviteEmail} className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" /> Invite
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Team Members</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getRoleBadgeColor(member.role)}`}>
                      {member.role.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadge(member.status)}`}>
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, "lawyer")}>
                          <Edit2 className="w-4 h-4 mr-2" /> Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemove(member.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
