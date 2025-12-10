'use client'

import { memo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

import GlassBoard from '@/components/Board'
import FancyLighting from '@/components/Lighting'
import AliceCharacter from '@/components/AliceCharacter'
import { Pawn, Rook, Knight, Bishop, Queen } from '@/components/PieceModels'

const BOARD_TILES = 8
const TILE_SIZE = 1

function toWorldPos(x, y) {
  const half = (BOARD_TILES - 1) / 2
  return [(x - half) * TILE_SIZE, 0, (y - half) * TILE_SIZE]
}

// 기본 체스 말 배치
const DEFAULT_PIECES = [
  { Comp: Rook, x: 0, y: 0 },
  { Comp: Rook, x: 7, y: 0 },
  { Comp: Knight, x: 1, y: 0 },
  { Comp: Knight, x: 6, y: 0 },
  { Comp: Bishop, x: 2, y: 0 },
  { Comp: Bishop, x: 5, y: 0 },
  { Comp: Queen, x: 3, y: 0 },
  { Comp: Pawn, x: 2, y: 1 },
  { Comp: Pawn, x: 3, y: 1 },
  { Comp: Pawn, x: 4, y: 1 },
  { Comp: Pawn, x: 5, y: 1 },
]

// 기본 앨리스 위치
const DEFAULT_ALICE = { x: 7, y: 7 }

/* ───────────────────────────────
    3D Scene Component
────────────────────────────── */
const Scene3D = memo(({ aliceCell, pieces }) => (
  <Canvas
    shadows={false}
    dpr={[1, 1.5]}
    camera={{ position: [8, 12, 8], fov: 38, near: 0.1, far: 50 }}
    gl={{ preserveDrawingBuffer: false }}
    onCreated={({ gl }) => {
      const canvas = gl.getContext().canvas

      const onLost = (e) => {
        e.preventDefault()
        console.warn('⚠ WebGL Context Lost → Attempt Recovery')
      }
      const onRestored = () => console.warn('⚙ WebGL Context Restored!')

      canvas.addEventListener('webglcontextlost', onLost)
      canvas.addEventListener('webglcontextrestored', onRestored)

      return () => {
        canvas.removeEventListener('webglcontextlost', onLost)
        canvas.removeEventListener('webglcontextrestored', onRestored)
      }
    }}
    style={{ background: 'transparent' }}
  >
    <Suspense fallback={null}>
      <Environment preset="city" />
      <FancyLighting />
      <GlassBoard />

      <AliceCharacter boardX={aliceCell.x} boardY={aliceCell.y} />

      {pieces.map(({ Comp, x, y }, i) => {
        const [wx, , wz] = toWorldPos(x, y)
        return (
          <group key={i} position={[wx, 0, wz]}>
            <Comp />
          </group>
        )
      })}

      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
      />
    </Suspense>
  </Canvas>
))

Scene3D.displayName = 'Scene3D'

/* ───────────────────────────────
    GameBoard - 순수 3D 보드
────────────────────────────── */
export default function GameBoard({ 
  aliceCell = DEFAULT_ALICE, 
  pieces = DEFAULT_PIECES,
  style = {}
}) {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      ...style 
    }}>
      <Scene3D aliceCell={aliceCell} pieces={pieces} />
    </div>
  )
}

// Named exports for flexibility
export { Scene3D, DEFAULT_PIECES, DEFAULT_ALICE, toWorldPos }