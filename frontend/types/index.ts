export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: "admin" | "lawyer" | "junior_lawyer"
  organizationId: string
  avatar?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  logo?: string
  subscription?: "free" | "pro" | "enterprise"
}

export interface Case {
  _id?: string
  id?: string
  title: string
  clientNames: string[]
  description?: string
  status: "open" | "ongoing" | "closed" | "on_hold"
  caseNumber: string
  assignedLawyers: any[]
  assignedJuniors: any[]
  createdAt: string
  updatedAt: string
  nextHearingDate?: string
  priority: "low" | "medium" | "high" | "urgent"
}

export interface Hearing {
  id: string
  caseId: string
  date: string
  time: string
  location: string
  judge?: string
  notes?: string
  status: "scheduled" | "completed" | "postponed"
  createdAt: string
}

export interface ChatMessage {
  id: string
  caseId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  message: string
  attachments?: string[]
  timestamp: string
  typingIndicator?: boolean
}

export interface CaseParticipant {
  id: string
  caseId: string
  userId: string
  userName: string
  role: "lawyer" | "junior" | "client" | "observer"
  accessLevel: "view" | "edit" | "admin"
}

export interface Document {
  id: string
  caseId: string
  fileName: string
  fileType: string
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
  size: number
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}
