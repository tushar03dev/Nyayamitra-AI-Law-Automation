import axiosInstance from "@/lib/axios-instance"
import type { User } from "@/types"

export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await axiosInstance.post("/auth/signup", data)
    return response.data
  },

  sendOTP: async (email: string) => {
    const response = await axiosInstance.post("/auth/send-otp", { email })
    return response.data
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await axiosInstance.post("/auth/verify-otp", { email, otp })
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token)
    }
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token)
    }
    return response.data
  },

  googleAuth: async (token: string) => {
    const response = await axiosInstance.post("/auth/google", { token })
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token)
    }
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get("/auth/me")
    return response.data
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout")
    localStorage.removeItem("authToken")
  },
}
