"use client"

import { useState, useEffect } from "react"
import MapDashboard from "@/components/map-dashboard"
import EventLog from "@/components/event-log"
import DataPanel from "@/components/data-panel"
import { generateMockEvents, type TrackingEvent } from "@/lib/mock-data"

export default function Dashboard() {
  const [events, setEvents] = useState<TrackingEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TrackingEvent | null>(null)
  const [stats, setStats] = useState({ active: 0, resolved: 0, responseTime: 0 })

  useEffect(() => {
    const initialEvents = generateMockEvents(8)
    setEvents(initialEvents)
    if (initialEvents.length > 0) {
      setSelectedEvent(initialEvents[0])
    }

    // Simulate real-time event stream
    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvent = generateMockEvents(1)[0]
        const updated = [newEvent, ...prev.slice(0, 14)]
        return updated
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const active = events.filter((e) => e.status === "active").length
    const resolved = events.filter((e) => e.status === "resolved").length
    setStats({
      active,
      resolved,
      responseTime: Math.floor(Math.random() * 15) + 5,
    })
  }, [events])

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Left Panel - Event Log */}
      <EventLog events={events} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} />

      {/* Center Panel - 3D Map */}
      <div className="flex-1 relative">
        <MapDashboard events={events} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} />
      </div>

      {/* Right Panel - Data Dashboard */}
      <DataPanel event={selectedEvent} stats={stats} />
    </div>
  )
}
