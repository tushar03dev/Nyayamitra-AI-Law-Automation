import axiosInstance from "@/lib/axios-instance"
import type { Case, CaseParticipant, Document } from "@/types"

export const casesAPI = {
  getAll: async (filters?: {
    status?: string
    lawyerId?: string
    searchTerm?: string
    page?: number
    limit?: number
  }) => {
    const response = await axiosInstance.get("/cases", { params: filters })
    return response.data
  },

  getById: async (caseId: string): Promise<Case> => {
    const response = await axiosInstance.get(`/cases/${caseId}`)
    return response.data
  },

  create: async (data: Partial<Case>): Promise<Case> => {
    const response = await axiosInstance.post("/cases", data)
    return response.data
  },

  update: async (caseId: string, data: Partial<Case>): Promise<Case> => {
    const response = await axiosInstance.put(`/cases/${caseId}`, data)
    return response.data
  },

  delete: async (caseId: string) => {
    await axiosInstance.delete(`/cases/${caseId}`)
  },

  getParticipants: async (caseId: string): Promise<CaseParticipant[]> => {
    const response = await axiosInstance.get(`/cases/${caseId}/participants`)
    return response.data
  },

  addParticipant: async (caseId: string, data: { userId: string; role: string; accessLevel: string }) => {
    const response = await axiosInstance.post(`/cases/${caseId}/participants`, data)
    return response.data
  },

  removeParticipant: async (caseId: string, userId: string) => {
    await axiosInstance.delete(`/cases/${caseId}/participants/${userId}`)
  },

  getDocuments: async (caseId: string): Promise<Document[]> => {
    const response = await axiosInstance.get(`/cases/${caseId}/documents`)
    return response.data
  },

  uploadDocument: async (caseId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await axiosInstance.post(`/cases/${caseId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },
}
