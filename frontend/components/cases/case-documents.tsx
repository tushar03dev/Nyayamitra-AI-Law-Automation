"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useCase } from "@/context/case-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Upload, Download, Trash2 } from "lucide-react"
import axiosInstance from "@/lib/axios-instance"

interface Document {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
  size: number
}

export default function CaseDocuments({ caseId }: { caseId: string }) {
  const { getDocuments } = useCase()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [caseId])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const data = await getDocuments(caseId)
      setDocuments(data)
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch documents", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axiosInstance.post(`/cases/${caseId}/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setDocuments([...documents, response.data])
      toast({ title: "Success", description: "Document uploaded" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload document", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      await axiosInstance.delete(`/cases/${caseId}/documents/${docId}`)
      setDocuments(documents.filter((d) => d.id !== docId))
      toast({ title: "Success", description: "Document deleted" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete document", variant: "destructive" })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Upload documents</p>
            <p className="text-xs text-gray-500">Drag and drop or click to select</p>
          </div>
          <input type="file" hidden onChange={handleFileUpload} disabled={uploading} />
        </label>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No documents uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)} • Uploaded by {doc.uploadedBy}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
