"use client"
import { useEffect, useRef } from "react"
import { RubyGlassMaterial } from "./materials"

/** 🔥 공통 GPU Dispose 훅 */
function useDispose(ref) {
  useEffect(() => {
    return () => {
      const mesh = ref.current
      if (!mesh) return

      // Geometry Dispose
      mesh.geometry?.dispose?.()

      // Material Dispose
      const mat = mesh.material
      if (Array.isArray(mat)) {
        mat.forEach(m => m?.dispose?.())
      } else {
        mat?.dispose?.()
      }
    }
  }, [])
}

/* ─────────────────────────────
   Pawn
────────────────────────────── */
export function Pawn() {
  const base = useRef()
  const body = useRef()
  const head = useRef()
  ;[base, body, head].forEach(useDispose)

  const baseHeight = 0.08
  const bodyHeight = 0.85

  return (
    <group>
      <mesh ref={base} position={[0, baseHeight * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.33, 0.37, baseHeight, 48]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={body} position={[0, baseHeight + bodyHeight / 7, 0]} castShadow>
        <latheGeometry
          args={[
            [
              [0.28, 0],
              [0.23, bodyHeight * 0.25],
              [0.20, bodyHeight * 0.55],
              [0.22, bodyHeight * 0.75],
              [0.24, bodyHeight],
            ].map(([x, y]) => ({ x, y }))
          ]}
        />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={head} position={[0, baseHeight + bodyHeight + 0.13, 0]} castShadow>
        <sphereGeometry args={[0.2, 54, 54]} />
        <RubyGlassMaterial />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────
   Rook
────────────────────────────── */
export function Rook() {
  const base = useRef()
  const body = useRef()
  const ring = useRef()
  ;[base, body, ring].forEach(useDispose)

  const crenels = [...Array(8)].map(() => useRef())
  crenels.forEach(useDispose)

  const baseHeight = 0.12
  const bodyHeight = 1.0

  return (
    <group>
      <mesh ref={base} position={[0, baseHeight * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.38, baseHeight, 48]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={body} position={[0, baseHeight + bodyHeight * 0.02, 0]} castShadow>
        <latheGeometry
          args={[
            [
              { x: 0.32, y: 0 },
              { x: 0.30, y: bodyHeight * 0.35 },
              { x: 0.28, y: bodyHeight * 0.70 },
              { x: 0.30, y: bodyHeight },
            ],
            60,
          ]}
        />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={ring} position={[0, baseHeight + bodyHeight + 0.04, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.12, 48]} />
        <RubyGlassMaterial />
      </mesh>

      {crenels.map((ref, i) => {
        const angle = (i / crenels.length) * Math.PI * 2
        const r = 0.29
        return (
          <mesh
            key={i}
            ref={ref}
            position={[Math.cos(angle) * r, baseHeight + bodyHeight + 0.12, Math.sin(angle) * r]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.11, 0.20, 0.11]} />
            <RubyGlassMaterial />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─────────────────────────────
   Knight
────────────────────────────── */
export function Knight() {
  const refs = [...Array(1 + 1 + 1 + 1 + 5 + 2)].map(() => useRef())
  refs.forEach(useDispose)

  const [
    base, body, neck, face,
    ...rest
  ] = refs

  const maneRefs = rest.slice(0, 5)
  const earRefs = rest.slice(5)

  const baseH = 0.12

  return (
    <group>
      <mesh ref={base} position={[0, baseH * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.38, baseH, 48]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={body} position={[0, baseH + 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.30, 0.34, 0.65, 32]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh
        ref={neck}
        position={[0, baseH + 0.9, 0.12]}
        rotation={[Math.PI * 0.28, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.18, 0.24, 0.35, 24]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh
        ref={face}
        position={[0, baseH + 1.14, 0.16]}
        rotation={[Math.PI * -0.25, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.18, 0.15, 0.3, 20]} />
        <RubyGlassMaterial />
      </mesh>

      {maneRefs.map((ref, i) => (
        <mesh key={i}
          ref={ref}
          position={[0, baseH + 1.05 - i * 0.1, -0.16]}
          rotation={[Math.PI * 0.1, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.32, 0.11, 0.05]} />
          <RubyGlassMaterial />
        </mesh>
      ))}

      {earRefs.map((ref, i) => (
        <mesh key={i}
          ref={ref}
          position={[[-0.09, 0.09][i], baseH + 1.26, -0.04]}
          castShadow
        >
          <coneGeometry args={[0.06, 0.18, 20]} />
          <RubyGlassMaterial />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────
   Bishop
────────────────────────────── */
export function Bishop() {
  const base = useRef()
  const body = useRef()
  const head = useRef()
  useDispose(base)
  useDispose(body)
  useDispose(head)

  const height = 1.25

  return (
    <group>
      <mesh ref={base} position={[0, 0.12 * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.38, 0.12, 48]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={body} position={[0, 0.1 + height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.29, height, 50]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={head} position={[0, 0.2 + height, 0]} castShadow>
        <sphereGeometry args={[0.21, 32, 32]} />
        <RubyGlassMaterial />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────
   Queen
────────────────────────────── */
export function Queen() {
  const refs = [...Array(5)].map(() => useRef())
  refs.forEach(useDispose)

  const [base, dress, body, head, crown] = refs

  return (
    <group castShadow>
      <mesh ref={base} position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.47, 0.50, 0.16, 40]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={dress} position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.34, 0.55, 32]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={body} position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.48, 22, 32]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={head} position={[0, 1.33, 0]} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <RubyGlassMaterial />
      </mesh>

      <mesh ref={crown} position={[0, 1.48, 0]} castShadow>
        <torusGeometry args={[0.26, 0.05, 14, 40]} />
        <RubyGlassMaterial />
      </mesh>
    </group>
  )
}
