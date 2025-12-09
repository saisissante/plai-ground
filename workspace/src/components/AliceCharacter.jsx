"use client"
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BOARD_TILES = 8
const TILE_SIZE = 1

function toWorldPos(x, y) {
  const half = (BOARD_TILES - 1) / 2
  return [(x - half) * TILE_SIZE, 0, (y - half) * TILE_SIZE]
}

/** 🔥 공통 GPU 리소스 정리 훅 */
function useDispose(ref) {
  useEffect(() => {
    return () => {
      const mesh = ref.current
      if (!mesh) return

      mesh.geometry?.dispose?.()
      const mat = mesh.material
      if (Array.isArray(mat)) mat.forEach(m => m?.dispose?.())
      else mat?.dispose?.()
    }
  }, [])
}

export default function AliceCharacter({ boardX = 0, boardY = 4 }) {
  const groupRef = useRef()

  // ⭐ 모든 ref를 직접 선언 (훅 규칙 준수)
  const refBase = useRef()
  const refBody = useRef()
  const refTorso = useRef()
  const refHead = useRef()
  const refHair = useRef()
  const refRibbon = useRef()

  ;[
    refBase,
    refBody,
    refTorso,
    refHead,
    refHair,
    refRibbon,
  ].forEach(useDispose)

  const targetPos = useRef(new THREE.Vector3())
  const currentPos = useRef(new THREE.Vector3())
  const [wx, , wz] = toWorldPos(boardX, boardY)

  useEffect(() => {
    targetPos.current.set(wx, 0, wz)
    if (currentPos.current.length() === 0) {
      currentPos.current.copy(targetPos.current)
      groupRef.current?.position.copy(currentPos.current)
    }
  }, [wx, wz])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    currentPos.current.lerp(targetPos.current, Math.min(delta * 5, 1))
    groupRef.current.position.copy(currentPos.current)

    const dist = currentPos.current.distanceTo(targetPos.current)
    groupRef.current.position.y = dist > 0.01
      ? Math.sin(state.clock.elapsedTime * 8) * 0.02
      : 0
  })

  return (
    <group ref={groupRef} castShadow>
      <mesh ref={refBase} position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.45, 0.16, 40]} />
        <meshPhysicalMaterial color="#a6c8ff" roughness={0.45} metalness={0.1} clearcoat={0.5} clearcoatRoughness={0.25}/>
      </mesh>

      <mesh ref={refBody} position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.40, 0.30, 0.5, 32]} />
        <meshPhysicalMaterial color="#8fb4ff" roughness={0.35} metalness={0.15} clearcoat={0.6} clearcoatRoughness={0.2}/>
      </mesh>

      <mesh ref={refTorso} position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.45, 18, 32]} />
        <meshPhysicalMaterial color="#a4c6ff" roughness={0.4} metalness={0.1} clearcoat={0.5}/>
      </mesh>

      <mesh ref={refHead} position={[0, 1.28, 0]} castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshPhysicalMaterial color="#ffdcb5" roughness={0.35} metalness={0.05} clearcoat={0.4}/>
      </mesh>

      <mesh ref={refHair} position={[0, 1.27, -0.04]} castShadow>
        <sphereGeometry args={[0.26, 32, 32, 0, Math.PI*2, 0, Math.PI*0.6]} />
        <meshPhysicalMaterial color="#e0b45c" roughness={0.5} metalness={0.15}/>
      </mesh>

      <mesh ref={refRibbon} position={[0, 1.47, 0]} castShadow>
        <torusGeometry args={[0.20, 0.045, 14, 40]} />
        <meshPhysicalMaterial color="#ff8abf" roughness={0.35} metalness={0.1} clearcoat={0.6}/>
      </mesh>
    </group>
  )
}
