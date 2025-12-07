"use client"

import { useEffect, useState } from "react"
import { useCase } from "@/context/case-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Search, Plus, FileText } from "lucide-react"
import Link from "next/link"

export default function CaseList() {
  const { cases, loading, fetchCases, error } = useCase()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all") // Updated default value
  const [priorityFilter, setPriorityFilter] = useState<string>("all") // Updated default value
  const [filteredCases, setFilteredCases] = useState(cases)

  useEffect(() => {
    fetchCases()
  }, [])

  useEffect(() => {
    let filtered = cases

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.clientNames.some((name) => name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((c) => c.priority === priorityFilter)
    }

    setFilteredCases(filtered)
  }, [searchQuery, statusFilter, priorityFilter, cases])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (error) {
    toast({ title: "Error", description: error, variant: "destructive" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-600 mt-1">Manage all your legal cases</p>
        </div>
        <Link href="/cases/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Case
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by title, case number or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Cases Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Title</TableHead>
                <TableHead>Case Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No cases found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id} className="hover:bg-gray-50">
                    <TableCell className="font-semibold text-gray-900">
                      <Link href={`/cases/${caseItem.id}`} className="hover:text-blue-600">
                        {caseItem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{caseItem.caseNumber}</TableCell>
                    <TableCell className="text-sm text-gray-600">{caseItem.clientNames.join(", ")}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(caseItem.status)}>{caseItem.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold text-sm ${getPriorityColor(caseItem.priority)}`}>
                        ● {caseItem.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{caseItem.assignedLawyers.length} lawyers</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {caseItem.nextHearingDate ? new Date(caseItem.nextHearingDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/cases/${caseItem.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
