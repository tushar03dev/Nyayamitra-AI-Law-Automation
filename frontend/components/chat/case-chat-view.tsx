"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@/context/chat-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Send, Paperclip } from "lucide-react"
import type { ChatMessage } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface CaseChatViewProps {
  caseId: string
}

export function CaseChatView({ caseId }: CaseChatViewProps) {
  const { messages, fetchMessages, sendMessage, loading } = useChat()
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState("")
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages(caseId)
  }, [caseId])

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
      await sendMessage(caseId, inputValue.trim())
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

  // Demo messages for UI display
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
        <h1 className="text-3xl font-bold tracking-tight">Case Discussion</h1>
        <p className="text-muted-foreground mt-1">Real-time team communication for this case</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Team Chat</CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading && localMessages.length === 0 ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : displayMessages.length > 0 ? (
                displayMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {msg.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{msg.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1 break-words">{msg.message}</p>
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
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-3 items-end bg-muted/30">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !inputValue.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Participants Sidebar */}
        <div className="w-80">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Participants</CardTitle>
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
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent/50">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-accent text-foreground text-xs">
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
                    <p className="font-medium text-sm truncate">{participant.name}</p>
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
