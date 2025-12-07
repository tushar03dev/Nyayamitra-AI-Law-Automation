"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useChat } from "@/context/chat-context"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Send, Paperclip } from "lucide-react"
import type { ChatMessage } from "@/types"
import { useToast } from "@/components/ui/use-toast"

interface CaseChatViewProps {
  caseId: string
}

export function CaseChatView({ caseId }: CaseChatViewProps) {
  const { messages, fetchMessages, sendMessage, loading } = useChat()
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState("")
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  const { toast } = useToast()

  // Initialize Socket.io connection
  useEffect(() => {
    fetchMessages(caseId)
    initializeSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [caseId])

  const initializeSocket = () => {
    try {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        auth: {
          caseId,
          userId: user?.id,
        },
      })

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id)
        setIsConnected(true)
        socket.emit('join-case', caseId)
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
        setIsConnected(false)
      })

      socket.on("message", (data: ChatMessage) => {
        console.log("New message received:", data)
        setLocalMessages((prev) => [...prev, data])
        scrollToBottom()
      })

      socket.on("error", (error: any) => {
        console.error("Socket error:", error)
      })

      socketRef.current = socket
    } catch (error) {
      console.error("Socket initialization error:", error)
    }
  }

  useEffect(() => {
    setLocalMessages(messages)
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      // Send via Socket.io if connected, otherwise use REST API
      if (socketRef.current?.connected) {
        console.log("[v0] Sending message via socket")
        socketRef.current.emit("message", {
          caseId,
          message: inputValue.trim(),
          senderId: user?.id,
          senderName: user?.name,
          timestamp: new Date().toISOString(),
        })
      } else {
        console.log("[v0] Sending message via REST API")
        await sendMessage(caseId, inputValue.trim())
      }
      setInputValue("")
      scrollToBottom()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    }
  }

  // Demo messages for UI display if no real data
  const demoMessages: ChatMessage[] = [
    {
      id: "m1",
      caseId,
      senderId: "u1",
      senderName: "Senior Lawyer",
      message: "We have received the latest documents from the opposing counsel. Let me review them.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "m2",
      caseId,
      senderId: "u2",
      senderName: "Junior Associate",
      message: "I've prepared a summary of the key points. Should I send it to the client?",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "m3",
      caseId,
      senderId: "u1",
      senderName: "Senior Lawyer",
      message: "Yes, please send it. Also prepare for next week's hearing.",
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
  ]

  const displayMessages = localMessages.length > 0 ? localMessages : demoMessages

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Case Discussion</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">Real-time team communication for this case</p>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Offline"}</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden bg-card border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg text-foreground">Team Chat</CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading && localMessages.length === 0 ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full bg-muted" />
                  ))}
                </div>
              ) : displayMessages.length > 0 ? (
                displayMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                        {msg.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{msg.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1 break-words bg-muted/40 rounded px-3 py-2 mt-2">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-border p-4 flex gap-3 items-end bg-background/50"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !inputValue.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Participants Sidebar */}
        <div className="w-80">
          <Card className="h-full flex flex-col bg-card border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg text-foreground">Participants</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { id: "u1", name: "Senior Lawyer", role: "lawyer", online: true },
                { id: "u2", name: "Junior Associate", role: "junior_lawyer", online: true },
                {
                  id: "u3",
                  name: "Paralegal",
                  role: "junior_lawyer",
                  online: false,
                },
              ].map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-foreground text-xs font-semibold">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {participant.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">{participant.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
