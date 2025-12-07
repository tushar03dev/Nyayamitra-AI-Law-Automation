"use client"

import { useState, useCallback } from "react"
import axiosInstance from "@/lib/axios-instance"

interface UseAxiosOptions {
  autoFetch?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useAxios<T = any>(url: string | null, options: UseAxiosOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const fetchData = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(url)
      setData(response.data)
      options.onSuccess?.(response.data)
    } catch (err: any) {
      setError(err.response?.data || err.message)
      options.onError?.(err)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { data, loading, error, refetch: fetchData }
}
