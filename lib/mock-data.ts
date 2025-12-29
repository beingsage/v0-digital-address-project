export interface TrackingEvent {
  id: string
  title: string
  description: string
  status: "active" | "resolved"
  type: "pursuit" | "incident" | "alert" | "patrol"
  timestamp: string
  location: {
    lat: number
    lng: number
  }
}

const eventTypes = [
  { type: "pursuit", titles: ["High-Speed Pursuit", "Urban Chase", "Suspect Apprehension"] },
  { type: "incident", titles: ["Traffic Accident", "Road Disturbance", "Traffic Jam"] },
  { type: "alert", titles: ["Zone Alert", "Security Warning", "Anomaly Detection"] },
  { type: "patrol", titles: ["Patrol Mission", "Routine Check", "Security Patrol"] },
]

const descriptions = [
  "Target moving at high speed on main arterial road, exceeding speed limit",
  "Suspicious individual detected in designated area",
  "Traffic anomaly detected, units dispatched for investigation",
  "Area surveillance system detected unusual activity",
  "Multiple units deployed to incident location",
  "Real-time tracking of target position and movement trajectory",
]

// Los Angeles area coordinates for realistic map display
const laArea = {
  centerLat: 34.0522,
  centerLng: -118.2437,
  radiusLat: 0.05,
  radiusLng: 0.05,
}

export function generateMockEvents(count: number): TrackingEvent[] {
  const events: TrackingEvent[] = []

  for (let i = 0; i < count; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const typeItem = eventType.type
    const title = eventType.titles[Math.floor(Math.random() * eventType.titles.length)]

    const now = new Date()
    const minutes = Math.floor(Math.random() * 60)
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${(now.getMinutes() - minutes).toString().padStart(2, "0")}`

    const randomLat = laArea.centerLat + (Math.random() - 0.5) * laArea.radiusLat
    const randomLng = laArea.centerLng + (Math.random() - 0.5) * laArea.radiusLng

    events.push({
      id: `EVT${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      title,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: Math.random() > 0.3 ? "active" : "resolved",
      type: typeItem as "pursuit" | "incident" | "alert" | "patrol",
      timestamp,
      location: {
        lat: randomLat,
        lng: randomLng,
      },
    })
  }

  return events
}
