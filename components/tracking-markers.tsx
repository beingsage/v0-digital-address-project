"use client"

import { useRef, useEffect, useState } from "react"
import type * as THREE from "three"
import { Html } from "@react-three/drei"
import type { TrackingEvent } from "@/lib/mock-data"

interface TrackingMarkersProps {
  events: TrackingEvent[]
  selectedEvent: TrackingEvent | null
}

export default function TrackingMarkers({ events, selectedEvent }: TrackingMarkersProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [positions, setPositions] = useState<Record<string, [number, number, number]>>({})

  // Initialize and animate positions
  useEffect(() => {
    const initialPos: Record<string, [number, number, number]> = {}
    events.forEach((event) => {
      initialPos[event.id] = event.location
    })
    setPositions(initialPos)

    // Animate marker movements
    const interval = setInterval(() => {
      setPositions((prev) => {
        const updated = { ...prev }
        events.forEach((event) => {
          const current = updated[event.id] || event.location
          // Simulate natural movement
          const moveAmount = 0.5
          updated[event.id] = [
            current[0] + (Math.random() - 0.5) * moveAmount,
            0.5,
            current[2] + (Math.random() - 0.5) * moveAmount,
          ]
        })
        return updated
      })
    }, 100)

    return () => clearInterval(interval)
  }, [events])

  return (
    <group ref={groupRef}>
      {events.map((event) => {
        const pos = positions[event.id] || event.location
        const isSelected = selectedEvent?.id === event.id
        const isActive = event.status === "active"

        return (
          <group key={event.id} position={pos}>
            {/* Glow ring */}
            <mesh>
              <torusGeometry args={[3, 0.5, 8, 32]} />
              <meshStandardMaterial
                color={isActive ? "#eab308" : "#22c55e"}
                emissive={isActive ? "#eab308" : "#22c55e"}
                emissiveIntensity={isSelected ? 2 : 1}
                transparent
                opacity={isSelected ? 1 : 0.7}
              />
            </mesh>

            {/* Center marker */}
            <mesh position={[0, 0.1, 0]}>
              <icosahedronGeometry args={[1, 3]} />
              <meshStandardMaterial
                color={isActive ? "#eab308" : "#22c55e"}
                emissive={isActive ? "#eab308" : "#22c55e"}
                emissiveIntensity={isSelected ? 1.5 : 0.8}
                wireframe={isSelected}
              />
            </mesh>

            {/* Pulse animation (scale) - handled in shader */}
            {isActive && (
              <mesh position={[0, 0.1, 0]}>
                <icosahedronGeometry args={[2.5, 3]} />
                <meshStandardMaterial
                  color={isActive ? "#eab308" : "#22c55e"}
                  emissive={isActive ? "#eab308" : "#22c55e"}
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </mesh>
            )}

            {/* ID Label */}
            <Html distanceFactor={1.5}>
              <div className="text-xs font-bold whitespace-nowrap pointer-events-none select-none">
                <div className="text-cyan-300 drop-shadow-lg">{event.id.substring(0, 4).toUpperCase()}</div>
              </div>
            </Html>
          </group>
        )
      })}

      {/* Trail visualization - last 5 positions for selected event */}
      {selectedEvent && (
        <group>
          <mesh position={selectedEvent.location}>
            <cylinderGeometry args={[4, 4, 0.2, 32]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}
