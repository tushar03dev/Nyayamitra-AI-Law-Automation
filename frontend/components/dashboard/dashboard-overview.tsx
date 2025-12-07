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
import { Calendar, Users, FileText, TrendingUp, ArrowUpRight } from "lucide-react"
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
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Welcome back, {user?.firstName || user?.name}!</h1>
        <p className="text-muted-foreground text-lg">Here's your legal practice at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Cases</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats?.totalCases || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover:border-secondary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Active Cases</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-3xl font-bold text-foreground">{stats?.activeCases || 0}</p>
                <ArrowUpRight className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Upcoming Hearings</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats?.upcomingHearings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover:border-[hsl(150,70%,50%)]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Team Members</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats?.teamMembers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-[hsl(150,70%,50%)]/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[hsl(150,70%,50%)]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border-border">
          <TabsTrigger value="cases" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Case Status
          </TabsTrigger>
          <TabsTrigger value="workload" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Workload
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Hearings Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Cases by Status</h3>
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
                  {["hsl(200, 100%, 50%)", "hsl(280, 60%, 50%)", "hsl(30, 100%, 55%)", "hsl(150, 70%, 50%)"].map(
                    (color, idx) => (
                      <Cell key={idx} fill={color} />
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="workload">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Lawyer Workload</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.caseWorkload || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 25%)" />
                <XAxis dataKey="lawyer" stroke="hsl(0, 0%, 70%)" />
                <YAxis stroke="hsl(0, 0%, 70%)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220, 13%, 13%)", border: "1px solid hsl(220, 13%, 25%)" }}
                />
                <Bar dataKey="cases" fill="hsl(200, 100%, 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Upcoming Hearings Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.hearingTimeline || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 25%)" />
                <XAxis dataKey="date" stroke="hsl(0, 0%, 70%)" />
                <YAxis stroke="hsl(0, 0%, 70%)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220, 13%, 13%)", border: "1px solid hsl(220, 13%, 25%)" }}
                />
                <Line type="monotone" dataKey="count" stroke="hsl(200, 100%, 50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Upcoming Hearings</h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">No hearings in the next 7 days</p>
          </div>
          <Link href="/hearings">
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              View Calendar
            </Button>
          </Link>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">No recent activities</p>
          </div>
          <Link href="/cases">
            <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">View Cases</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export { DashboardOverview }
