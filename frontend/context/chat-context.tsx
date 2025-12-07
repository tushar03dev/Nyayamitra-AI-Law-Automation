"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface ChatMessage {
  id: string
  content: string
  sender: string
  senderName?: string
  timestamp: string
  caseId?: string
  attachments?: string[]
}

export interface ChatContextType {
  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  deleteMessage: (id: string) => void
  updateMessage: (id: string, message: Partial<ChatMessage>) => void
  isLoading: boolean
  currentCaseId?: string
  setCurrentCaseId: (id: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading] = useState(false)
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

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        addMessage,
        deleteMessage,
        updateMessage,
        isLoading,
        currentCaseId,
        setCurrentCaseId,
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
