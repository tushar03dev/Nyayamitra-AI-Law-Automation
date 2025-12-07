"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Case } from "@/types"

export interface CaseContextType {
  cases: Case[]
  selectedCase: Case | null
  loading: boolean
  error: string | null
  fetchCases: () => Promise<void>
  fetchCaseById: (id: string) => Promise<void>
  createCase: (caseData: Partial<Case>) => Promise<void>
  updateCase: (id: string, caseData: Partial<Case>) => Promise<void>
  deleteCase: (id: string) => Promise<void>
  getDocuments: (caseId: string) => Promise<any[]>
  getCaseParticipants: (caseId: string) => Promise<any[]>
  addCaseParticipant: (caseId: string, participant: any) => Promise<void>
  removeParticipant: (caseId: string, participantId: string) => Promise<void>
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCases = async () => {
    setLoading(true)
    setError(null)
    try {
      // Mock implementation - replace with actual API call
      setCases([])
    } catch (err: any) {
      setError(err.message || "Failed to fetch cases")
    } finally {
      setLoading(false)
    }
  }

  const fetchCaseById = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Mock implementation - replace with actual API call
      setSelectedCase(null)
    } catch (err: any) {
      setError(err.message || "Failed to fetch case")
    } finally {
      setLoading(false)
    }
  }

  const createCase = async (caseData: Partial<Case>) => {
    setLoading(true)
    setError(null)
    try {
      // Mock implementation - replace with actual API call
      const newCase: Case = {
        id: `case-${Date.now()}`,
        title: caseData.title || "",
        caseNumber: caseData.caseNumber || "",
        description: caseData.description,
        status: (caseData.status as any) || "open",
        priority: (caseData.priority as any) || "medium",
        clientNames: caseData.clientNames || [],
        createdAt: new Date().toISOString(),
      }
      setCases([...cases, newCase])
    } catch (err: any) {
      setError(err.message || "Failed to create case")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCase = async (id: string, caseData: Partial<Case>) => {
    setLoading(true)
    setError(null)
    try {
      // Mock implementation - replace with actual API call
      setCases(cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)))
    } catch (err: any) {
      setError(err.message || "Failed to update case")
    } finally {
      setLoading(false)
    }
  }

  const deleteCase = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Mock implementation - replace with actual API call
      setCases(cases.filter((c) => c.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete case")
    } finally {
      setLoading(false)
    }
  }

  const getDocuments = async (caseId: string) => {
    try {
      // Mock implementation - replace with actual API call
      return []
    } catch (err: any) {
      setError(err.message || "Failed to fetch documents")
      return []
    }
  }

  const getCaseParticipants = async (caseId: string) => {
    try {
      // Mock implementation - replace with actual API call
      return []
    } catch (err: any) {
      setError(err.message || "Failed to fetch participants")
      return []
    }
  }

  const addCaseParticipant = async (caseId: string, participant: any) => {
    try {
      // Mock implementation - replace with actual API call
    } catch (err: any) {
      setError(err.message || "Failed to add participant")
    }
  }

  const removeParticipant = async (caseId: string, participantId: string) => {
    try {
      // Mock implementation - replace with actual API call
    } catch (err: any) {
      setError(err.message || "Failed to remove participant")
    }
  }

  return (
    <CaseContext.Provider
      value={{
        cases,
        selectedCase,
        loading,
        error,
        fetchCases,
        fetchCaseById,
        createCase,
        updateCase,
        deleteCase,
        getDocuments,
        getCaseParticipants,
        addCaseParticipant,
        removeParticipant,
      }}
    >
      {children}
    </CaseContext.Provider>
  )
}

export function useCase(): CaseContextType {
  const context = useContext(CaseContext)
  if (!context) {
    throw new Error("useCase must be used within CaseProvider")
  }
  return context
}
