"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { TrackingEvent } from "@/lib/mock-data"

interface EventLogProps {
  events: TrackingEvent[]
  selectedEvent: TrackingEvent | null
  onSelectEvent: (event: TrackingEvent) => void
}

export default function EventLog({ events, selectedEvent, onSelectEvent }: EventLogProps) {
  const [filter, setFilter] = useState("all")

  const filtered = events.filter((e) => {
    if (filter === "active") return e.status === "active"
    if (filter === "resolved") return e.status === "resolved"
    return true
  })

  return (
    <div className="w-64 border-r border-cyan-500/30 bg-slate-950/50 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/30">
        <h2 className="text-sm font-bold text-cyan-400 mb-3">Real-Time Event Log</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-2 py-1 rounded ${
              filter === "all" ? "bg-cyan-500/30 text-cyan-300" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`text-xs px-2 py-1 rounded ${
              filter === "active"
                ? "bg-yellow-500/30 text-yellow-300"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`text-xs px-2 py-1 rounded ${
              filter === "resolved"
                ? "bg-green-500/30 text-green-300"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filtered.map((event) => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className={`w-full text-left p-3 rounded border transition-all ${
                selectedEvent?.id === event.id
                  ? "border-cyan-400 bg-cyan-500/20"
                  : "border-slate-700 hover:border-slate-600 bg-slate-900/50"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-xs text-cyan-300">{event.title}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    event.status === "active" ? "border-yellow-500 text-yellow-400" : "border-green-500 text-green-400"
                  }`}
                >
                  {event.status === "active" ? "In Progress" : "Resolved"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mb-2">{event.description}</p>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{event.timestamp}</span>
                <span>ID: {event.id}</span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
