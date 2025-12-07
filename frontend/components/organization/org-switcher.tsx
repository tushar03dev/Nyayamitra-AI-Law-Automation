"use client"

import { useAuth } from "@/context/auth-context"
import { useOrganization } from "@/context/organization-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Building2, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios-instance"

interface OrgOption {
  id: string
  name: string
}

export default function OrgSwitcher() {
  const { user } = useAuth()
  const { organization } = useOrganization()
  const [orgs, setOrgs] = useState<OrgOption[]>([])

  useEffect(() => {
    fetchOrgs()
  }, [])

  const fetchOrgs = async () => {
    try {
      const response = await axiosInstance.get("/users/organizations")
      setOrgs(response.data)
    } catch (err) {
      console.error("Failed to fetch organizations")
    }
  }

  const handleSwitch = async (orgId: string) => {
    try {
      await axiosInstance.post("/users/switch-organization", { organizationId: orgId })
      window.location.reload()
    } catch (err) {
      console.error("Failed to switch organization")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium max-w-xs truncate">{organization?.name}</span>
          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className={organization?.id === org.id ? "bg-blue-50" : ""}
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {org.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
