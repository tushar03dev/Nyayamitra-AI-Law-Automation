import axiosInstance from "@/lib/axios-instance"

export const dashboardAPI = {
  getStats: async () => {
    const response = await axiosInstance.get("/dashboard/stats")
    return response.data
  },

  getCaseDistribution: async () => {
    const response = await axiosInstance.get("/dashboard/case-distribution")
    return response.data
  },

  getUpcomingHearings: async () => {
    const response = await axiosInstance.get("/dashboard/upcoming-hearings")
    return response.data
  },

  getRecentActivity: async (limit = 10) => {
    const response = await axiosInstance.get(`/dashboard/recent-activity?limit=${limit}`)
    return response.data
  },

  getLawyerWorkload: async () => {
    const response = await axiosInstance.get("/dashboard/lawyer-workload")
    return response.data
  },
}
