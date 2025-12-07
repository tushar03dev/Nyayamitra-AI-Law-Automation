"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import axiosInstance from "@/lib/axios-instance"
import { toast } from "@/hooks/use-toast"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"

interface Hearing {
  id: string
  caseId: string
  date: string
  time: string
  location: string
  judge?: string
  notes?: string
  status: "scheduled" | "completed" | "postponed"
  caseTitle?: string
}

export default function HearingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hearings, setHearings] = useState<Hearing[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHearings()
  }, [currentDate])

  const fetchHearings = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/hearings", {
        params: {
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        },
      })
      setHearings(response.data)
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch hearings", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getHearingsForDate = (date: Date) => {
    return hearings.filter((h) => {
      const hearingDate = new Date(h.date)
      return hearingDate.toDateString() === date.toDateString()
    })
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPriorityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "postponed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hearing Calendar</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Schedule Hearing
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{format(currentDate, "MMMM yyyy")}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayHearings = getHearingsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isTodayDate = isToday(day)

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-colors ${
                    !isCurrentMonth ? "bg-gray-50 border-gray-100" : "border-gray-200 hover:border-blue-400"
                  } ${isTodayDate ? "bg-blue-50 border-blue-300" : ""} ${
                    selectedDate?.toDateString() === day.toDateString() ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <p className={`text-sm font-semibold ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}`}>
                    {format(day, "d")}
                  </p>
                  <div className="mt-1 space-y-1">
                    {dayHearings.slice(0, 2).map((hearing) => (
                      <div
                        key={hearing.id}
                        className={`text-xs p-1 rounded truncate text-white ${getPriorityColor(hearing.status)}`}
                      >
                        {hearing.caseTitle}
                      </div>
                    ))}
                    {dayHearings.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayHearings.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Upcoming Hearings */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Hearings</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {hearings
              .filter((h) => h.status === "scheduled" && new Date(h.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((hearing) => (
                <div key={hearing.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-sm text-gray-900">{hearing.caseTitle}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {format(new Date(hearing.date), "MMM dd")} at {hearing.time}
                  </p>
                  <p className="text-xs text-gray-600">{hearing.location}</p>
                  {hearing.judge && <p className="text-xs text-gray-600 mt-1">Judge: {hearing.judge}</p>}
                </div>
              ))}
            {hearings.filter((h) => h.status === "scheduled").length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming hearings</p>
            )}
          </div>
        </Card>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
          <div className="space-y-3">
            {getHearingsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500">No hearings scheduled for this date</p>
            ) : (
              getHearingsForDate(selectedDate).map((hearing) => (
                <div key={hearing.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{hearing.caseTitle}</p>
                      <p className="text-sm text-gray-600">{hearing.time}</p>
                    </div>
                    <Badge className={getPriorityColor(hearing.status)}>{hearing.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">📍 {hearing.location}</p>
                  {hearing.judge && <p className="text-sm text-gray-600">👨‍⚖️ {hearing.judge}</p>}
                  {hearing.notes && <p className="text-sm text-gray-600 mt-2">📝 {hearing.notes}</p>}
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
