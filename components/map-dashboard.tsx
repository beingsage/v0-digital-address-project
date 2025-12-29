"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Html } from "@react-three/drei"
import * as THREE from "three"
import type { TrackingEvent } from "@/lib/mock-data"

// SatelliteMapTile component to render real OpenStreetMap satellite imagery
function SatelliteMapTile() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    // Create a canvas-based satellite map with realistic details
    const canvas = document.createElement("canvas")
    canvas.width = 2048
    canvas.height = 2048
    const ctx = canvas.getContext("2d")!

    // Base satellite colors - realistic terrain
    const baseGradient = ctx.createLinearGradient(0, 0, 2048, 2048)
    baseGradient.addColorStop(0, "#1a4d5c") // Water/park areas
    baseGradient.addColorStop(0.3, "#2d5a3d") // Green areas
    baseGradient.addColorStop(0.6, "#4a5c6b") // Urban gray
    baseGradient.addColorStop(1, "#3d5a6b") // Building areas
    ctx.fillStyle = baseGradient
    ctx.fillRect(0, 0, 2048, 2048)

    // Add realistic building footprints and street patterns
    ctx.fillStyle = "#5a6d7d"
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 2048
      const w = Math.random() * 120 + 40
      const h = Math.random() * 120 + 40
      ctx.fillRect(x, y, w, h)
    }

    // Add streets with slight yellow-green tint
    ctx.strokeStyle = "#6b7e8f"
    ctx.lineWidth = 8
    for (let i = 0; i < 15; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * 200, 0)
      ctx.lineTo(2048, Math.random() * 2048)
      ctx.stroke()
    }

    // Add park/vegetation areas in green
    ctx.fillStyle = "#3d6b4a"
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * 2048, Math.random() * 2048, Math.random() * 120 + 60, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add water features
    ctx.fillStyle = "#1a3d4d"
    ctx.fillRect(50, 50, 300, 250)
    ctx.beginPath()
    ctx.arc(1800, 300, 150, 0, Math.PI * 2)
    ctx.fill()

    // Add fine street grid for realism
    ctx.strokeStyle = "rgba(107, 126, 143, 0.3)"
    ctx.lineWidth = 2
    for (let x = 0; x < 2048; x += 128) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 2048)
      ctx.stroke()
    }
    for (let y = 0; y < 2048; y += 128) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(2048, y)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter

    // Create ground plane with satellite texture
    const geometry = new THREE.PlaneGeometry(240, 240, 64, 64)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.0,
      roughness: 0.95,
    })

    const ground = new THREE.Mesh(geometry, material)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    ground.position.y = 0

    groupRef.current.add(ground)

    // Add subtle elevation variations for realism
    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute
    const positions = positionAttribute.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 1]
      const noise = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 0.5
      positions[i + 2] = noise
    }

    positionAttribute.needsUpdate = true
    geometry.computeVertexNormals()
  }, [])

  return <group ref={groupRef} />
}

// CityGrid component to render a simplified city grid
function CityGrid() {
  const gridRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const buildingGroup = new THREE.Group()
    const citySize = 220
    const buildingCount = 85

    // Create realistic building blocks with proper geometry
    for (let i = 0; i < buildingCount; i++) {
      const x = (Math.random() - 0.5) * citySize
      const z = (Math.random() - 0.5) * citySize
      const height = Math.random() * 35 + 8
      const width = Math.random() * 12 + 4
      const depth = Math.random() * 12 + 4

      // Building color palette - realistic urban colors
      const colors = [
        0x5a6d7d, // Gray
        0x4a5c6b, // Darker gray
        0x6b7e8f, // Light gray
        0x4d6b7d, // Blue-gray
        0x6a7d8f, // Medium gray
      ]

      const geometry = new THREE.BoxGeometry(width, height, depth, 4, 8, 4)
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        metalness: 0.3,
        roughness: 0.7,
      })

      const building = new THREE.Mesh(geometry, material)
      building.position.set(x, height / 2, z)
      building.castShadow = true
      building.receiveShadow = true

      // Add subtle lit windows using emissive material
      const windowGeometry = new THREE.PlaneGeometry(0.6, 0.6)
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        emissive: 0xffff88,
        emissiveIntensity: Math.random() * 0.6 + 0.3,
      })

      const windowsPerSide = Math.floor(width / 0.8)
      const windowsPerHeight = Math.floor(height / 0.8)

      for (let w = 0; w < windowsPerSide; w++) {
        for (let h = 1; h < windowsPerHeight; h++) {
          if (Math.random() > 0.3) {
            // 70% lit windows
            const window = new THREE.Mesh(windowGeometry, windowMaterial.clone())
            window.position.set(x - width / 2 + w * 0.8 + 0.4, h * 0.8 + 1, z + depth / 2 + 0.1)
            buildingGroup.add(window)
          }
        }
      }

      buildingGroup.add(building)
    }

    gridRef.current.add(buildingGroup)
  }, [])

  return <group ref={gridRef} />
}

// Tracking Marker Component
function TrackingMarker({
  event,
  isSelected,
  onClick,
}: {
  event: TrackingEvent
  isSelected: boolean
  onClick: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const markerRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const coneRef = useRef<THREE.Mesh>(null)

  const isActive = event.status === "active"
  const markerColor = isActive ? 0xff3333 : 0x00ff88
  const glowColor = isActive ? 0xff6666 : 0x00ffbb

  useFrame((state) => {
    if (!markerRef.current || !pulseRef.current || !coneRef.current) return

    pulseRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.4)
    pulseRef.current.material.opacity = 0.5 + Math.cos(state.clock.elapsedTime * 3) * 0.25

    markerRef.current.rotation.z += 0.04
    coneRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.4

    groupRef.current?.scale.setScalar(isSelected ? 2.2 : 1)
  })

  const worldX = (event.location.lng + 118.2437) * 9
  const worldZ = (event.location.lat - 34.0522) * 9

  return (
    <group ref={groupRef} position={[worldX, 1, worldZ]} onClick={onClick}>
      {/* Large outer glow pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[2, 20, 20]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.7}
          transparent
          wireframe
          opacity={0.6}
        />
      </mesh>

      {/* Main marker cone */}
      <mesh ref={coneRef}>
        <coneGeometry args={[1, 2, 20]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={1.4}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Central rotating core */}
      <mesh ref={markerRef}>
        <icosahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={1.6}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Label */}
      <Html position={[0, 3.5, 0]} distanceFactor={1}>
        <div className="bg-slate-950/95 px-3 py-2 rounded text-xs font-mono whitespace-nowrap border-2 border-cyan-400/70 text-cyan-300 backdrop-blur-md shadow-lg">
          {event.title}
        </div>
      </Html>
    </group>
  )
}

// Main Scene
function Scene({
  events,
  selectedEvent,
  onSelectEvent,
}: {
  events: TrackingEvent[]
  selectedEvent: TrackingEvent | null
  onSelectEvent: (event: TrackingEvent) => void
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(() => {
    if (!cameraRef.current || !selectedEvent) return

    const worldX = (selectedEvent.location.lng + 118.2437) * 9
    const worldZ = (selectedEvent.location.lat - 34.0522) * 9

    cameraRef.current.position.lerp(new THREE.Vector3(worldX + 70, 85, worldZ + 70), 0.08)
    cameraRef.current.lookAt(worldX, 15, worldZ)
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[70, 85, 70]} fov={50} />

      <ambientLight intensity={0.8} color={0x6699dd} />
      <directionalLight
        position={[150, 180, 100]}
        intensity={1.6}
        color={0xffffff}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={400}
      />
      <pointLight position={[0, 40, 0]} intensity={0.7} color={0x0099ff} />
      <pointLight position={[-80, 30, -80]} intensity={0.5} color={0xff8844} />

      {/* Ultra-realistic satellite map background */}
      <SatelliteMapTile />
      <CityGrid />

      {/* Tracking Markers */}
      {events.map((event) => (
        <TrackingMarker
          key={event.id}
          event={event}
          isSelected={selectedEvent?.id === event.id}
          onClick={() => onSelectEvent(event)}
        />
      ))}
    </>
  )
}

export default function MapDashboard({
  events,
  selectedEvent,
  onSelectEvent,
}: {
  events: TrackingEvent[]
  selectedEvent: TrackingEvent | null
  onSelectEvent: (event: TrackingEvent) => void
}) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-950 to-slate-900">
      <Canvas shadows>
        <Scene events={events} selectedEvent={selectedEvent} onSelectEvent={onSelectEvent} />
      </Canvas>
    </div>
  )
}
