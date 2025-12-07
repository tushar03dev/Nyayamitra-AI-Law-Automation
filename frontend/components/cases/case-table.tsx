"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Case } from "@/types"
import { ArrowRight } from "lucide-react"

interface CaseTableProps {
  cases: Case[]
}

export function CaseTable({ cases }: CaseTableProps) {
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent">
            <TableHead>Case Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Next Hearing</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow key={caseItem.id} className="hover:bg-accent/50">
              <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
              <TableCell>{caseItem.title}</TableCell>
              <TableCell className="text-sm">{caseItem.clientNames?.join(", ") || "N/A"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(caseItem.status)}>{caseItem.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPriorityColor(caseItem.priority)}>
                  {caseItem.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {caseItem.nextHearingDate ? new Date(caseItem.nextHearingDate).toLocaleDateString() : "TBD"}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/cases/${caseItem.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    View <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
