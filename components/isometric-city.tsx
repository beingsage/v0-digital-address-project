"use client"

import { useRef, useMemo } from "react"
import type * as THREE from "three"

export default function IsometricCity() {
  const groupRef = useRef<THREE.Group>(null)

  // Generate procedural buildings
  const buildings = useMemo(() => {
    const buildings = []
    const gridSize = 20
    const spacing = 8

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const height = Math.random() * 15 + 5
        const posX = (x - gridSize / 2) * spacing
        const posZ = (z - gridSize / 2) * spacing

        buildings.push({
          pos: [posX, height / 2, posZ],
          size: [6, height, 6],
          color: x % 2 === z % 2 ? "#1e3a8a" : "#0c4a6e",
          id: `${x}-${z}`,
        })
      }
    }
    return buildings
  }, [])

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f172a" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: 25 }).map((_, i) => {
        const pos = (i - 12) * 8
        return (
          <group key={`grid-${i}`}>
            <line position={[pos, 0.01, -96]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, 0, 0, 192])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#06b6d4" opacity={0.2} transparent />
            </line>
            <line position={[-96, 0.01, pos]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, 192, 0, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#06b6d4" opacity={0.2} transparent />
            </line>
          </group>
        )
      })}

      {/* Buildings */}
      {buildings.map((building) => (
        <mesh key={building.id} position={building.pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={building.size as [number, number, number]} />
          <meshStandardMaterial
            color={building.color}
            metalness={0.4}
            roughness={0.6}
            emissive={building.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Perimeter lights */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const radius = 110
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return <pointLight key={`light-${i}`} position={[x, 20, z]} intensity={0.3} color="#06b6d4" distance={60} />
      })}
    </group>
  )
}
