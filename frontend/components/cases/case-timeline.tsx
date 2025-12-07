"use client"

export default function CaseTimeline({ caseId }: { caseId: string }) {
  const activities = [
    { id: 1, action: "Case created", user: "John Doe", timestamp: "2024-01-15 10:00 AM" },
    { id: 2, action: "Document uploaded", user: "Jane Smith", timestamp: "2024-01-15 02:30 PM" },
    { id: 3, action: "Team member added", user: "John Doe", timestamp: "2024-01-16 09:00 AM" },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <div key={activity.id} className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          </div>
          <div className="flex-1 pb-4 {idx !== activities.length - 1 ? 'border-l-2 border-gray-200' : ''}">
            <p className="font-medium text-gray-900">{activity.action}</p>
            <p className="text-sm text-gray-600">
              {activity.user} • {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
