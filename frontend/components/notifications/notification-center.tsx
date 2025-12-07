"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Check, Trash2, MoreVertical } from "lucide-react"
import axiosInstance from "@/lib/axios-instance"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 5 seconds
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications")
      setNotifications(response.data)
    } catch (err) {
      console.error("Failed to fetch notifications")
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`)
      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    } catch (err) {
      toast({ title: "Error", description: "Failed to update notification", variant: "destructive" })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`)
      setNotifications(notifications.filter((n) => n.id !== notificationId))
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete notification", variant: "destructive" })
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && <p className="text-sm text-gray-600 mt-1">{unreadCount} unread</p>}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full m-2" />)
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex gap-3 items-start ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 truncate">{notification.title}</p>
                    <Badge className={`text-xs ${getTypeColor(notification.type)}`}>{notification.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{format(new Date(notification.createdAt), "HH:mm")}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                        <Check className="w-4 h-4 mr-2" /> Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => deleteNotification(notification.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
