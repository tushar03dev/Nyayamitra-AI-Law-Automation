import axiosInstance from "@/lib/axios-instance"
import type { Organization, User } from "@/types"

export const organizationAPI = {
  getById: async (orgId: string): Promise<Organization> => {
    const response = await axiosInstance.get(`/organizations/${orgId}`)
    return response.data
  },

  create: async (data: Partial<Organization>): Promise<Organization> => {
    const response = await axiosInstance.post("/organizations", data)
    return response.data
  },

  update: async (orgId: string, data: Partial<Organization>): Promise<Organization> => {
    const response = await axiosInstance.put(`/organizations/${orgId}`, data)
    return response.data
  },

  getMembers: async (orgId: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/organizations/${orgId}/members`)
    return response.data
  },

  addMember: async (orgId: string, data: { email: string; role: string }) => {
    const response = await axiosInstance.post(`/organizations/${orgId}/members`, data)
    return response.data
  },

  removeMember: async (orgId: string, userId: string) => {
    await axiosInstance.delete(`/organizations/${orgId}/members/${userId}`)
  },

  updateMemberRole: async (orgId: string, userId: string, role: string) => {
    const response = await axiosInstance.put(`/organizations/${orgId}/members/${userId}`, { role })
    return response.data
  },
}
