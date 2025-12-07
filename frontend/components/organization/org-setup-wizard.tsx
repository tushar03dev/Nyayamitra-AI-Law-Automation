"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axios-instance"
import { useAuth } from "@/context/auth-context"
import { useOrganization } from "@/context/organization-context"
import { Building2, Users, Shield, ArrowRight } from "lucide-react"

export default function OrgSetupWizard() {
  const { user } = useAuth()
  const { organization, updateOrganization } = useOrganization()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [orgData, setOrgData] = useState({
    name: organization?.name || "",
    email: organization?.email || "",
    phone: organization?.phone || "",
    address: organization?.address || "",
  })

  const handleOrgUpdate = async () => {
    setLoading(true)
    try {
      await updateOrganization(orgData)
      toast({ title: "Success", description: "Organization updated" })
      setStep(2)
    } catch (err) {
      toast({ title: "Error", description: "Failed to update organization", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Your Organization</h1>
        <p className="text-gray-600">Complete these steps to get your firm ready</p>
      </div>

      <Tabs value={`step-${step}`} className="w-full">
        {/* Step 1: Organization Details */}
        <div className="mb-6">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Organization Details</h3>
                <div className="space-y-4">
                  <Input
                    label="Firm Name"
                    placeholder="Your law firm name"
                    value={orgData.name}
                    onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="firm@example.com"
                    value={orgData.email}
                    onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    value={orgData.phone}
                    onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                  />
                  <Input
                    label="Address"
                    placeholder="123 Law Street, City, State"
                    value={orgData.address}
                    onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                  />
                  <Button
                    onClick={handleOrgUpdate}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? "Saving..." : "Continue"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Step 2: Team Members */}
        {step >= 2 && (
          <div className="mb-6">
            <TeamManagementCard onContinue={() => setStep(3)} />
          </div>
        )}

        {/* Step 3: Access Control */}
        {step >= 3 && (
          <div className="mb-6">
            <AccessControlCard />
          </div>
        )}
      </Tabs>
    </div>
  )
}

function TeamManagementCard({ onContinue }: { onContinue: () => void }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"lawyer" | "junior_lawyer">("lawyer")
  const [team, setTeam] = useState<Array<{ email: string; role: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleAddMember = async () => {
    if (!email) return
    setLoading(true)
    try {
      await axiosInstance.post("/organizations/invite-member", { email, role })
      setTeam([...team, { email, role }])
      setEmail("")
      toast({ title: "Success", description: "Invitation sent" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to invite member", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add Team Members</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="team member email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="lawyer">Lawyer</option>
                <option value="junior_lawyer">Junior Lawyer</option>
              </select>
              <Button onClick={handleAddMember} disabled={loading || !email} className="bg-blue-600 hover:bg-blue-700">
                Add
              </Button>
            </div>
            {team.length > 0 && (
              <div className="mt-4 space-y-2">
                {team.map((member, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                    <span className="text-sm text-gray-600">{member.email}</span>
                    <span className="text-xs font-semibold text-gray-500">{member.role}</span>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={onContinue} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function AccessControlCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Control Setup</h3>
          <p className="text-gray-600 mb-4">
            Your organization is now set up! Team members can be assigned to specific cases with granular access
            control.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Available roles:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Admin: Full access to all cases and organization settings</li>
              <li>• Lawyer: Can manage assigned cases and invite juniors</li>
              <li>• Junior Lawyer: View and edit assigned cases only</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
}
