'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import FinalEnding from '@/components/FinalEnding'

export default function EndingScreen({ endingData, onRestart }) {
  const [phase, setPhase] = useState(0) // 0: 페이드인, 1: 타입 표시, 2: 스토리, 3: 메시지
  const [displayedText, setDisplayedText] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showFinalEnding, setShowFinalEnding] = useState(false) // 최종 엔딩 화면
  const typingRef = useRef(false) // 타이핑 중복 방지

  useEffect(() => {
    setMounted(true)
  }, [])

  // 클라이언트에서만 파티클 위치 생성
  const particles = useMemo(() => {
    if (!mounted) return []
    const emojis = ['✨', '♠️', '♦️', '♥️', '♣️']
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      emoji: emojis[i % emojis.length],
    }))
  }, [mounted])

  useEffect(() => {
    // 페이즈 전환 타이머
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 6000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  // 엔딩 텍스트 타이핑
  useEffect(() => {
    if (phase >= 2 && endingData?.endingText) {
      if (typingRef.current) return // 이미 타이핑 중이면 무시
      
      typingRef.current = true
      let index = 0
      const interval = setInterval(() => {
        if (index < endingData.endingText.length) {
          setDisplayedText(endingData.endingText.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          typingRef.current = false
        }
      }, 30)

      return () => {
        clearInterval(interval)
        typingRef.current = false
      }
    }
  }, [phase, endingData?.endingText])

  // 최종 엔딩 화면 표시
  if (showFinalEnding) {
    return <FinalEnding endingData={endingData} onRestart={onRestart} />
  }

  if (!endingData) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(to bottom, #0a0a0a, #1a0a20, #0a0a0a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'auto',
      padding: '20px',
    }}>
      {/* 배경 파티클 */}
      {mounted && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                fontSize: '1rem',
                left: p.left,
                top: p.top,
                opacity: 0.2,
                animation: `twinkle ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      <div style={{
        maxWidth: '700px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* 엔딩 제목 */}
        <div style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 1s ease',
          marginBottom: '40px',
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#c9a227',
            letterSpacing: '4px',
            marginBottom: '10px',
          }}>
            ✦ THE END ✦
          </div>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            background: 'linear-gradient(to right, #c084fc, #f472b6, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
          }}>
            {endingData.endingTitle}
          </h1>
        </div>

        {/* 플레이어 타입 */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.8s ease',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '20px 40px',
            background: 'linear-gradient(135deg, rgba(147,51,234,0.2), rgba(219,39,119,0.2))',
            borderRadius: '16px',
            border: '2px solid rgba(201,162,39,0.3)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
              {endingData.playerTypeEmoji}
            </div>
            <div style={{
              fontSize: '1.3rem',
              color: '#c9a227',
              fontWeight: 'bold',
            }}>
              {endingData.playerType}
            </div>
          </div>
        </div>

        {/* 성향 태그들 */}
        {phase >= 1 && endingData.traits && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '30px',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}>
            {endingData.traits.map((trait, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(147,51,234,0.2)',
                  border: '1px solid rgba(147,51,234,0.4)',
                  borderRadius: '20px',
                  color: '#c084fc',
                  fontSize: '0.85rem',
                }}
              >
                #{trait}
              </span>
            ))}
          </div>
        )}

        {/* 엔딩 스토리 */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          marginBottom: '30px',
        }}>
          <div style={{
            background: 'rgba(20,15,30,0.8)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid rgba(147,51,234,0.2)',
            textAlign: 'left',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1.05rem',
              lineHeight: '1.9',
            }}>
              {displayedText}
            </p>
          </div>
        </div>

        {/* 개인 메시지 */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          marginBottom: '40px',
        }}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(201,162,39,0.1), rgba(147,51,234,0.1))',
            borderRadius: '12px',
            borderLeft: '4px solid #c9a227',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              fontStyle: 'italic',
              lineHeight: '1.7',
            }}>
              "{endingData.message}"
            </p>
          </div>
        </div>

        {/* 현실로 돌아가기 버튼 */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <button
            onClick={() => setShowFinalEnding(true)}
            style={{
              padding: '16px 40px',
              fontSize: '1.1rem',
              borderRadius: '30px',
              border: 'none',
              background: 'linear-gradient(135deg, #9333ea, #db2777)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(147,51,234,0.4)',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = '0 15px 40px rgba(147,51,234,0.6)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 10px 30px rgba(147,51,234,0.4)'
            }}
          >
            🦋 현실로 돌아가기
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}