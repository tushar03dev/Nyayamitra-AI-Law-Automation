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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch cases')
      }
      const data = await response.json()
      setCases(data)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch case')
      }
      const data = await response.json()
      setSelectedCase(data)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      })
      if (!response.ok) {
        throw new Error('Failed to create case')
      }
      const newCase = await response.json()
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      })
      if (!response.ok) {
        throw new Error('Failed to update case')
      }
      const updatedCase = await response.json()
      setCases(cases.map((c) => (c._id === id || c.id === id ? updatedCase : c)))
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cases/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete case')
      }
      setCases(cases.filter((c) => c._id !== id && c.id !== id))
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
