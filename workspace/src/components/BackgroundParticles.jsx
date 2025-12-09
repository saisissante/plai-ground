'use client'

import { useEffect, useState } from 'react'

export default function BackgroundParticles() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // 파티클 생성
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      animationDelay: Math.random() * 10,
      size: 5 + Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(195, 177, 225, ${particle.opacity}) 0%, rgba(255, 209, 220, ${particle.opacity * 0.5}) 100%)`,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        />
      ))}
    </div>
  )
}