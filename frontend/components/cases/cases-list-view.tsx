"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCase } from "@/context/case-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Filter } from "lucide-react"
import type { Case } from "@/types"

export function CasesListView() {
  const { cases, fetchCases, loading } = useCase()
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    fetchCases()
  }, [])

  useEffect(() => {
    let result = cases

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.clientNames?.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      result = result.filter((c) => c.priority === priorityFilter)
    }

    setFilteredCases(result)
  }, [cases, searchTerm, statusFilter, priorityFilter])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      ongoing: "bg-yellow-100 text-yellow-800",
      closed: "bg-green-100 text-green-800",
      on_hold: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-50 text-green-700",
      medium: "bg-yellow-50 text-yellow-700",
      high: "bg-orange-50 text-orange-700",
      urgent: "bg-red-50 text-red-700",
    }
    return colors[priority] || "bg-gray-50 text-gray-700"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground mt-1">Manage all your legal cases in one place</p>
        </div>
        <Link href="/cases/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredCases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((caseItem) => (
            <Link key={caseItem._id || caseItem.id} href={`/cases/${caseItem._id || caseItem.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{caseItem.caseNumber}</p>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Clients</p>
                    <p className="text-sm font-medium">
                      {caseItem.clientNames?.slice(0, 2).join(", ")}
                      {caseItem.clientNames && caseItem.clientNames.length > 2 && (
                        <span className="text-muted-foreground"> +{caseItem.clientNames.length - 2} more</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className={getPriorityColor(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                    {caseItem.nextHearingDate && (
                      <span className="text-muted-foreground">
                        {new Date(caseItem.nextHearingDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {caseItem.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{caseItem.description}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No cases found</p>
            <Link href="/cases/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first case
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
