import axiosInstance from "@/lib/axios-instance"
import type { ChatMessage } from "@/types"

export const chatAPI = {
  getMessages: async (caseId: string, params?: { page?: number; limit?: number }): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get(`/cases/${caseId}/messages`, { params })
    return response.data
  },

  sendMessage: async (caseId: string, data: { message: string; attachments?: string[] }): Promise<ChatMessage> => {
    const response = await axiosInstance.post(`/cases/${caseId}/messages`, data)
    return response.data
  },

  deleteMessage: async (caseId: string, messageId: string) => {
    await axiosInstance.delete(`/cases/${caseId}/messages/${messageId}`)
  },
}
