// components/Lighting.jsx
"use client"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function FancyLighting() {
  const rimLightRef = useRef()
  const fillLightRef = useRef()

  // 미세하게 반짝이며 움직이는 느낌
  useFrame(({ clock }) => {
    if (rimLightRef.current) {
      const t = clock.getElapsedTime()
      rimLightRef.current.position.x = Math.sin(t * 0.3) * 6
      rimLightRef.current.position.z = Math.cos(t * 0.3) * 6
    }
  })

  return (
    <>
      {/* 전체 부드러운 밝기 */}
      <ambientLight intensity={0.3} />

      {/* 메인 스포트라이트 (하이라이트 강조) */}
      <directionalLight
        position={[6, 14, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={35}
      />

      {/* 금빛 Rim Light ✨ (보석 윤곽) */}
      <pointLight
        ref={rimLightRef}
        color="#ffdf91"
        intensity={0.5}
        distance={16}
        position={[4, 6, 4]}
      />

      {/* 반대쪽 Fill Light (유리 반사 채움) */}
      <pointLight
        ref={fillLightRef}
        color="#d0e4ff"
        intensity={0.4}
        distance={18}
        position={[-5, 4, -6]}
      />
    </>
  )
}