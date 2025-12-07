"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, Plus } from "lucide-react"
import type { Hearing } from "@/types"

export function HearingsCalendarView() {
  const [view, setView] = useState<"month" | "list">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hearings, setHearings] = useState<Hearing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHearings()
  }, [])

  const fetchHearings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hearings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch hearings')
      }
      const data = await response.json()
      setHearings(data)
    } catch (error) {
      console.error('Failed to fetch hearings:', error)
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const getHearingsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return hearings.filter((h) => new Date(h.date).toDateString() === date.toDateString())
  }

  const upcomingHearings = hearings
    .filter((h) => new Date(h.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hearings Calendar</h1>
            <p className="text-muted-foreground mt-1">Manage all scheduled hearings and dates</p>
          </div>
        </div>
        <div className="text-center py-12">Loading hearings...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hearings Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage all scheduled hearings and dates</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Hearing
        </Button>
      </div>

      {/* View Tabs */}
      <Tabs value={view} onValueChange={(v: any) => setView(v)} className="w-full">
        <TabsList>
          <TabsTrigger value="month">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{monthName}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Empty cells for days before month starts */}
              <div className="grid grid-cols-7 gap-2 auto-rows-32">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-muted/20 rounded" />
                ))}

                {/* Days */}
                {days.map((day) => {
                  const dayHearings = getHearingsForDay(day)
                  const isToday =
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear()

                  return (
                    <div
                      key={day}
                      className={`p-2 rounded border min-h-32 ${
                        isToday ? "bg-primary/10 border-primary" : "hover:bg-accent/50"
                      }`}
                    >
                      <p className={`text-sm font-semibold mb-1 ${isToday ? "text-primary" : ""}`}>{day}</p>
                      <div className="space-y-1">
                        {dayHearings.slice(0, 2).map((hearing) => (
                          <div
                            key={hearing.id}
                            className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 truncate cursor-pointer hover:bg-blue-200"
                          >
                            {hearing.time}
                          </div>
                        ))}
                        {dayHearings.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{dayHearings.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Hearings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingHearings.length > 0 ? (
                  upcomingHearings.map((hearing) => (
                    <div key={hearing.id} className="border rounded-lg p-4 hover:bg-accent/50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{(hearing as any).caseTitle || `Case ${(hearing as any).caseId}`}</h3>
                          {hearing.notes && <p className="text-sm text-muted-foreground mt-1">{hearing.notes}</p>}
                        </div>
                        <Badge
                          className={
                            hearing.status === "scheduled" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }
                        >
                          {hearing.status}
                        </Badge>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(hearing.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {hearing.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {hearing.location}
                        </div>
                        {hearing.judge && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            {hearing.judge}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Notify
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No upcoming hearings scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hearing Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {hearings.filter((h) => h.status === "scheduled" && new Date(h.date) > new Date()).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Upcoming hearings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{hearings.filter((h) => h.status === "completed").length}</p>
            <p className="text-xs text-muted-foreground mt-1">Past hearings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {
                hearings.filter((h) => {
                  const hDate = new Date(h.date)
                  return (
                    hDate.getMonth() === currentDate.getMonth() && hDate.getFullYear() === currentDate.getFullYear()
                  )
                }).length
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">In {monthName}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
