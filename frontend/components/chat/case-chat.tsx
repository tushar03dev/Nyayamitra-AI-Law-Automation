"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@/context/chat-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Send, Paperclip } from "lucide-react"
import { format } from "date-fns"
import axiosInstance from "@/lib/axios-instance"

interface Message {
  id: string
  senderName: string
  senderAvatar?: string
  message: string
  timestamp: string
  attachments?: string[]
}

export default function CaseChat({ caseId }: { caseId: string }) {
  const { user } = useAuth()
  const { messages, loading, fetchMessages, sendMessage } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages(caseId)
    // Poll for new messages every 2 seconds
    const interval = setInterval(() => fetchMessages(caseId), 2000)
    return () => clearInterval(interval)
  }, [caseId, fetchMessages])

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setSending(true)
    try {
      await sendMessage(caseId, inputValue)
      setInputValue("")
      toast({ title: "Success", description: "Message sent" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await axiosInstance.post(`/cases/${caseId}/attachments/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      await sendMessage(caseId, `[File: ${file.name}]`, [response.data.url])
      toast({ title: "Success", description: "File uploaded" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload file", variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold">No messages yet</p>
              <p className="text-sm">Start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.senderName === user?.firstName + " " + user?.lastName
              return (
                <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md ${isCurrentUser ? "bg-blue-600" : "bg-gray-100"} rounded-lg p-4`}
                  >
                    {!isCurrentUser && (
                      <p className={`text-sm font-semibold ${isCurrentUser ? "text-white" : "text-gray-900"} mb-1`}>
                        {msg.senderName}
                      </p>
                    )}
                    <p className={`text-sm ${isCurrentUser ? "text-white" : "text-gray-700"}`}>{msg.message}</p>
                    <p className={`text-xs mt-2 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                      {format(new Date(msg.timestamp), "HH:mm")}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <label className="cursor-pointer text-gray-400 hover:text-gray-600">
            <Paperclip className="w-5 h-5" />
            <input type="file" hidden onChange={handleFileUpload} />
          </label>

          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={sending}
            className="flex-1"
          />

          <Button
            size="sm"
            disabled={!inputValue.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
