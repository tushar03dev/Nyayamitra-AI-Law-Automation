"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCase } from "@/context/case-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Plus, X } from "lucide-react"

export default function CaseForm() {
  const router = useRouter()
  const { createCase } = useCase()
  const [loading, setLoading] = useState(false)
  const [clientNames, setClientNames] = useState<string[]>([""])

  const [formData, setFormData] = useState({
    title: "",
    caseNumber: "",
    description: "",
    status: "open" as const,
    priority: "medium" as const,
  })

  const handleAddClient = () => {
    setClientNames([...clientNames, ""])
  }

  const handleRemoveClient = (index: number) => {
    setClientNames(clientNames.filter((_, i) => i !== index))
  }

  const handleClientChange = (index: number, value: string) => {
    const updated = [...clientNames]
    updated[index] = value
    setClientNames(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createCase({
        ...formData,
        clientNames: clientNames.filter((name) => name.trim()),
      })
      toast({ title: "Success", description: "Case created successfully" })
      router.push("/cases")
    } catch (err) {
      toast({ title: "Error", description: "Failed to create case", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Case</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Case Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Title</label>
              <Input
                required
                placeholder="e.g., Smith vs. Jones"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Number</label>
              <Input
                required
                placeholder="e.g., CV-2024-001"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                placeholder="Describe the case..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Clients</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddClient}>
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </div>

          <div className="space-y-3">
            {clientNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Client name"
                  value={name}
                  onChange={(e) => handleClientChange(index, e.target.value)}
                />
                {clientNames.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveClient(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? "Creating..." : "Create Case"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
