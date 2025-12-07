"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { ChatMessage } from "@/types"

export interface ChatContextType {
  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  deleteMessage: (id: string) => void
  updateMessage: (id: string, message: Partial<ChatMessage>) => void
  loading: boolean
  currentCaseId?: string
  setCurrentCaseId: (id: string) => void
  fetchMessages: (caseId: string) => Promise<void>
  sendMessage: (caseId: string, message: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading] = useState(false)
  const [currentCaseId, setCurrentCaseId] = useState<string>()

  const addMessage = (message: ChatMessage) => {
    setMessages([...messages, message])
  }

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id))
  }

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const fetchMessages = async (caseId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages?caseId=${caseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const messages = await response.json();
        setMessages(messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  const sendMessage = async (caseId: string, message: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          caseId,
          message,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        addMessage,
        deleteMessage,
        updateMessage,
        loading,
        currentCaseId,
        setCurrentCaseId,
        fetchMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}
