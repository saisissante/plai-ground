// components/Board.jsx
"use client"
import { useMemo } from "react"
import { RubyGlassMaterial } from "./materials"

const BOARD_TILES = 8
const TILE_SIZE = 1

function toWorldPos(x, y) {
  const half = (BOARD_TILES - 1) / 2
  return [(x - half) * TILE_SIZE, 0, (y - half) * TILE_SIZE]
}

function GlassTileMaterial({ dark }) {
  return (
    <meshPhysicalMaterial
      color={dark ? "#2b2e34" : "#f2f5fa"}
      roughness={0.12}
      metalness={0.25}
      transmission={0.55}
      thickness={0.4}
      reflectivity={0.9}
      ior={1.48}
      transparent
    />
  )
}

function WoodMaterial() {
  return (
    <meshPhysicalMaterial
      color="#2f1c0f"
      roughness={0.55}
      metalness={0.2}
      clearcoat={0.4}
      clearcoatRoughness={0.25}
    />
  )
}

export default function GlassBoard() {
  const tiles = useMemo(() => {
    const arr = []
    for (let y = 0; y < BOARD_TILES; y++) {
      for (let x = 0; x < BOARD_TILES; x++) {
        const [wx, , wz] = toWorldPos(x, y)
        arr.push(
          <mesh
            key={`${x}-${y}`}
            position={[wx, 0.015, wz]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[TILE_SIZE * 0.98, 0.04, TILE_SIZE * 0.98]} />
            <GlassTileMaterial dark={(x + y) % 2 === 1} />
          </mesh>
        )
      }
    }
    return arr
  }, [])

  return (
    <group>
      {/* 원목 프레임 : 두께 반으로 줄임 */}
      <mesh
        position={[0, -0.07, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry
          args={[
            BOARD_TILES * 1.25,
            0.14,
            BOARD_TILES * 1.25,
          ]}
        />
        <WoodMaterial />
      </mesh>

      {/* 유리 타일 */}
      {tiles}
    </group>
  )
}
