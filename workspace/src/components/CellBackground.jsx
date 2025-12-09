'use client'

import { useState, useEffect } from 'react'

// 각 칸의 테마 (실제로는 이미지 경로)
const CELL_THEMES = {
  '0-0': { name: '시작의 숲', color: 'from-green-400 to-emerald-600', emoji: '🌳' },
  '0-1': { name: '미스터리 정원', color: 'from-pink-400 to-rose-600', emoji: '🌹' },
  '1-0': { name: '시간의 방', color: 'from-blue-400 to-indigo-600', emoji: '⏰' },
  '1-1': { name: '거울의 홀', color: 'from-purple-400 to-violet-600', emoji: '🪞' },
  // ... 나머지 64개 칸
}

export default function CellBackground({ cell, isTransitioning, onTransitionComplete }) {
  const [fadeState, setFadeState] = useState('visible') // 'visible', 'fading-out', 'fading-in'
  const [currentBg, setCurrentBg] = useState(null)

  useEffect(() => {
    if (isTransitioning) {
      // 페이드아웃
      setFadeState('fading-out')
      
      setTimeout(() => {
        // 배경 변경
        const cellKey = `${cell.x}-${cell.y}`
        setCurrentBg(CELL_THEMES[cellKey] || CELL_THEMES['0-0'])
        
        // 페이드인
        setFadeState('fading-in')
        
        setTimeout(() => {
          setFadeState('visible')
          onTransitionComplete?.()
        }, 1000)
      }, 1000)
    }
  }, [isTransitioning, cell, onTransitionComplete])

  const cellKey = `${cell.x}-${cell.y}`
  const theme = currentBg || CELL_THEMES[cellKey] || CELL_THEMES['0-0']

  return (
    <>
      {/* 오버레이 (페이드 효과) */}
      <div 
        className={`fixed inset-0 bg-black pointer-events-none transition-opacity duration-1000 z-30 ${
          fadeState === 'fading-out' ? 'opacity-100' :
          fadeState === 'fading-in' ? 'opacity-0' :
          'opacity-0'
        }`}
      />

      {/* 배경 */}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${theme.color}`}>
        {/* 임시: 그라디언트 배경 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="text-[30rem]">{theme.emoji}</div>
        </div>

        {/* 실제 사용 예시 (이미지가 있을 때) */}
        {/*
        <img 
          src={`/images/backgrounds/cell-${cell.x}-${cell.y}.jpg`}
          alt={theme.name}
          className="w-full h-full object-cover"
        />
        */}
        
        {/* 배경 이름 표시 */}
        <div className="absolute top-4 left-4 text-white text-2xl font-bold drop-shadow-lg">
          {theme.name}
        </div>
      </div>
    </>
  )
}