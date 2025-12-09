'use client'

import { useEffect } from 'react'

export default function WorldUpdateFX({ effects, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="glitch-effect text-center">
        <h2 className="text-6xl wonderland-font text-purple-600 mb-4">
          World Update
        </h2>
        <div className="space-y-2">
          {effects.map((effect, index) => (
            <div
              key={index}
              className="text-2xl font-bold text-pink-500 fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              ✨ {effect}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}