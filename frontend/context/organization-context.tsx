"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Organization {
  id: string
  name: string
  description?: string
  logo?: string
  email?: string
  phone?: string
}

export interface OrganizationContextType {
  organization: Organization | null
  setOrganization: (org: Organization | null) => void
  isLoading: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading] = useState(false)

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization, isLoading }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider")
  }
  return context
}
