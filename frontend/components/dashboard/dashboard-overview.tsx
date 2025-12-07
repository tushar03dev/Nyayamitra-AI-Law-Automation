"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/auth/auth-provider"
import { useCase } from "@/context/case-context"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Users, FileText, TrendingUp } from "lucide-react"
import axiosInstance from "@/lib/axios-instance"
import Link from "next/link"

interface DashboardStats {
  totalCases: number
  activeCases: number
  upcomingHearings: number
  teamMembers: number
  casesByStatus: Array<{ status: string; count: number }>
  casesByPriority: Array<{ priority: string; count: number }>
  caseWorkload: Array<{ lawyer: string; cases: number }>
  hearingTimeline: Array<{ date: string; count: number }>
}

function DashboardOverview() {
  const { user } = useAuth()
  const { cases } = useCase()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/dashboard/stats")
      setStats(response.data)
    } catch (err) {
      console.error("Failed to fetch stats")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName || user?.name}!</h1>
        <p className="text-blue-100">Here's what's happening with your cases today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalCases || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeCases || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Upcoming Hearings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.upcomingHearings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.teamMembers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cases">Case Status</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="timeline">Hearings Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Cases by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.casesByStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {["#3B82F6", "#10B981", "#F59E0B", "#EF4444"].map((color, idx) => (
                    <Cell key={idx} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="workload">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Lawyer Workload</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.caseWorkload || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lawyer" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming Hearings Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.hearingTimeline || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Hearings</h3>
          <div className="space-y-3">
            {/* Placeholder for upcoming hearings list */}
            <p className="text-sm text-gray-600">No hearings in the next 7 days</p>
          </div>
          <Link href="/hearings">
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View Calendar
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {/* Placeholder for activities */}
            <p className="text-sm text-gray-600">No recent activities</p>
          </div>
          <Link href="/cases">
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View Cases
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export { DashboardOverview }
