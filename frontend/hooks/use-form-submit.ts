"use client"

import { useState, useCallback } from "react"

export function useFormSubmit<T = any>(onSubmit: (data: any) => Promise<T>, onSuccess?: (data: T) => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(
    async (formData: any) => {
      setLoading(true)
      setError(null)
      try {
        const result = await onSubmit(formData)
        onSuccess?.(result)
        return result
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred"
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [onSubmit, onSuccess],
  )

  return { submit, loading, error, clearError: () => setError(null) }
}
