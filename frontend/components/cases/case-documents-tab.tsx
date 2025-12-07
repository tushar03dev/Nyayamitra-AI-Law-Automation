"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, Trash2, FileText } from "lucide-react"
import type { Document } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface CaseDocumentsTabProps {
  caseId: string
}

export function CaseDocumentsTab({ caseId }: CaseDocumentsTabProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      caseId,
      fileName: "Case Summary.pdf",
      fileType: "pdf",
      fileUrl: "#",
      uploadedBy: "Senior Lawyer",
      uploadedAt: new Date().toISOString(),
      size: 2048576,
    },
    {
      id: "doc2",
      caseId,
      fileName: "Evidence Collection.docx",
      fileType: "docx",
      fileUrl: "#",
      uploadedBy: "Junior Associate",
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      size: 512000,
    },
  ])
  const { toast } = useToast()

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id))
    toast({ title: "Success", description: "Document removed" })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">Drag and drop documents here</p>
            <Button variant="outline">Select Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent rounded">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} • Uploaded by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No documents yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
