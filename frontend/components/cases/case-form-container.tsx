"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCase } from "@/context/case-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CaseFormContainer() {
  const router = useRouter()
  const { createCase, loading } = useCase()
  const { toast } = useToast()
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

    const validClients = clientNames.filter((name) => name.trim())
    if (!formData.title || !formData.caseNumber || validClients.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await createCase({
        ...formData,
        clientNames: validClients,
      })
      toast({
        title: "Success",
        description: "Case created successfully!",
      })
      router.push("/cases")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create case",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Case</h1>
        <p className="text-muted-foreground mt-1">Add a new legal case to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Information */}
        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
            <CardDescription>Enter the basic details of the case</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Smith vs. Corporation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="caseNumber">Case Number *</Label>
                <Input
                  id="caseNumber"
                  placeholder="e.g., CV-2024-001"
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the case..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status" className="mt-2">
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
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority" className="mt-2">
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
          </CardContent>
        </Card>

        {/* Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Clients *</CardTitle>
              <CardDescription>Add one or more clients to this case</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddClient}
              className="gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientNames.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Client name"
                    value={name}
                    onChange={(e) => handleClientChange(index, e.target.value)}
                  />
                  {clientNames.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveClient(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Case
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
