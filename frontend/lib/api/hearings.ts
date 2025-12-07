import axiosInstance from "@/lib/axios-instance"
import type { Hearing } from "@/types"

export const hearingsAPI = {
  getByCaseId: async (caseId: string): Promise<Hearing[]> => {
    const response = await axiosInstance.get(`/cases/${caseId}/hearings`)
    return response.data
  },

  getUpcoming: async (params?: { days?: number }) => {
    const response = await axiosInstance.get("/hearings/upcoming", { params })
    return response.data
  },

  create: async (data: Partial<Hearing>): Promise<Hearing> => {
    const response = await axiosInstance.post("/hearings", data)
    return response.data
  },

  update: async (hearingId: string, data: Partial<Hearing>): Promise<Hearing> => {
    const response = await axiosInstance.put(`/hearings/${hearingId}`, data)
    return response.data
  },

  delete: async (hearingId: string) => {
    await axiosInstance.delete(`/hearings/${hearingId}`)
  },
}
