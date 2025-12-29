"use client"

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei"
import { useState } from "react"
import IsometricCity from "./isometric-city"
import TrackingMarkers from "./tracking-markers"
import type { TrackingEvent } from "@/lib/mock-data"

interface CitySceneProps {
  events: TrackingEvent[]
  selectedEvent: TrackingEvent | null
}

export default function CityScene({ events, selectedEvent }: CitySceneProps) {
  const [animate, setAnimate] = useState(true)

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [100, 100, 100], fov: 50 }} gl={{ antialias: true, alpha: true, stencil: false }}>
        <PerspectiveCamera makeDefault position={[100, 100, 100]} fov={50} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.6} color="#4a90e2" />
        <directionalLight position={[100, 100, 50]} intensity={0.8} color="#06b6d4" castShadow />
        <pointLight position={[-100, 80, -100]} intensity={0.4} color="#eab308" />

        {/* Environment */}
        <color attach="background" args={["#0f172a"]} />

        {/* City Grid */}
        <IsometricCity />

        {/* Tracking Markers */}
        <TrackingMarkers events={events} selectedEvent={selectedEvent} />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400 bg-slate-950/70 px-3 py-2 rounded border border-cyan-500/30">
        <div>Active Tracks: {events.filter((e) => e.status === "active").length}</div>
        <div>Incidents: {events.length}</div>
      </div>
    </div>
  )
}
