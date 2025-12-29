"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TrackingEvent } from "@/lib/mock-data"

interface DataPanelProps {
  event: TrackingEvent | null
  stats: { active: number; resolved: number; responseTime: number }
}

export default function DataPanel({ event, stats }: DataPanelProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-80 border-l border-cyan-500/30 bg-slate-950/50 backdrop-blur overflow-y-auto p-4 space-y-3">
      <h2 className="text-sm font-bold text-cyan-400 mb-4">Event Details Dashboard</h2>

      {/* Global Stats */}
      <Card className="bg-slate-900/50 border-cyan-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs text-cyan-300">System Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Active Incidents:</span>
            <span className={`font-bold ${stats.active > 0 ? "text-yellow-400" : "text-green-400"}`}>
              {stats.active}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Resolved:</span>
            <span className="font-bold text-green-400">{stats.resolved}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Avg Response Time:</span>
            <span className="font-bold text-cyan-400">{stats.responseTime}min</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Event Details */}
      {event ? (
        <>
          <Card className="bg-slate-900/50 border-cyan-500/30">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xs text-cyan-300">{event.title}</CardTitle>
                <Badge
                  className={`text-xs ${
                    event.status === "active"
                      ? "bg-yellow-500/30 text-yellow-300 border-yellow-500"
                      : "bg-green-500/30 text-green-300 border-green-500"
                  }`}
                  variant="outline"
                >
                  {event.status === "active" ? "In Progress" : "Resolved"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-xs text-slate-300">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-400">Event ID</p>
                  <p className="text-xs font-mono text-cyan-400">{event.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Type</p>
                  <p className="text-xs font-mono text-cyan-400 capitalize">{event.type}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Location Coordinates</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400">Latitude</p>
                    <p className="font-bold text-cyan-300">{event.location.lat.toFixed(4)}°</p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <p className="text-slate-400">Longitude</p>
                    <p className="font-bold text-cyan-300">{event.location.lng.toFixed(4)}°</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                <p className="text-xs font-mono text-slate-300">{event.timestamp}</p>
              </div>
            </CardContent>
          </Card>

          {/* Mini Stats */}
          {event.status === "active" && (
            <Card className="bg-slate-900/50 border-yellow-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs text-yellow-300">Live Tracking Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Speed:</span>
                  <span className="font-bold text-yellow-400">{(Math.random() * 100 + 20).toFixed(1)} km/h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Heading:</span>
                  <span className="font-bold text-yellow-400">{Math.floor(Math.random() * 360)}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Signal Strength:</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded">
                    <div
                      className={`h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded transition-all ${
                        pulse ? "w-4/5" : "w-3/5"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-400 text-center">Select an event to view details</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
