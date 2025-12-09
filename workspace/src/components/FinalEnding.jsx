'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useGameStore from '@/state/useGameStore'

export default function FinalEnding({ endingData, onRestart }) {
  const router = useRouter()
  const resetGame = useGameStore((state) => state.resetGame)
  const [mounted, setMounted] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 순차적으로 요소 표시
    const contentTimer = setTimeout(() => setShowContent(true), 500)
    const quoteTimer = setTimeout(() => setShowQuote(true), 2000)
    const buttonTimer = setTimeout(() => setShowButton(true), 3500)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(quoteTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  // 눈송이 파티클 미리 계산
  const snowflakes = useMemo(() => {
    if (!mounted) return []
    return [...Array(50)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${0.4 + Math.random() * 0.6}rem`,
      opacity: 0.4 + Math.random() * 0.4,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 10,
    }))
  }, [mounted])

  // 별 파티클 미리 계산
  const stars = useMemo(() => {
    if (!mounted) return []
    const starEmojis = ['✨', '⭐', '🌟']
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${0.6 + Math.random() * 0.8}rem`,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 12,
      emoji: starEmojis[i % 3],
    }))
  }, [mounted])

  const handleRestart = () => {
    // Zustand 상태 리셋
    resetGame()
    
    // localStorage 전부 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drinkChoice')
      localStorage.removeItem('wonderland-game-v2')
      localStorage.removeItem('playerName')
    }
    
    // 메인 페이지로 이동
    router.push('/')
  }

  if (!mounted) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#000',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      {/* 배경 이미지 (액자 밖) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/tutorial/ending-bg.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        opacity: 0.3,
        filter: 'blur(3px)',
      }} />

      {/* 이미지 로드 실패 시 대체 배경 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #1a0a20, #0a0510, #1a0a20)',
        zIndex: -1,
      }} />

      {/* 비네트 효과 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)',
        pointerEvents: 'none',
      }} />

      {/* 눈송이 파티클 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {snowflakes.map((s) => (
          <div
            key={`snow-${s.id}`}
            style={{
              position: 'absolute',
              left: s.left,
              top: '-20px',
              fontSize: s.fontSize,
              opacity: s.opacity,
              animation: `snowfall ${s.duration}s linear infinite`,
              animationDelay: `${s.delay}s`,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      {/* 별 파티클 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s) => (
          <div
            key={`star-${s.id}`}
            style={{
              position: 'absolute',
              left: s.left,
              top: '-20px',
              fontSize: s.fontSize,
              opacity: s.opacity,
              animation: `starfall ${s.duration}s linear infinite`,
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.emoji}
          </div>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 10,
      }}>
        {/* 고딕 프레임 이미지 영역 */}
        <div style={{
          position: 'relative',
          width: '90%',
          maxWidth: '500px',
          aspectRatio: '4/3',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1.5s ease-out',
        }}>
          {/* 액자 프레임 */}
          <div style={{
            position: 'absolute',
            inset: '-15px',
            border: '4px solid #8b7355',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #5c4a32, #3d2e1f, #5c4a32)',
            boxShadow: `
              0 0 30px rgba(0,0,0,0.8),
              inset 0 0 20px rgba(0,0,0,0.5),
              0 0 60px rgba(201,162,39,0.2)
            `,
          }} />

          {/* 액자 내부 금장 테두리 */}
          <div style={{
            position: 'absolute',
            inset: '-5px',
            border: '2px solid #c9a227',
            borderRadius: '4px',
          }} />

          {/* 이미지 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a1520, #0d0a10)',
          }}>
            {/* 이미지 대체 (로드 실패 시만 보임) */}
            <div 
              id="fallback-emoji"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1520, #2d1f30, #1a1520)',
                zIndex: 1,
              }}
            >
              <div style={{ 
                fontSize: 'clamp(4rem, 15vw, 8rem)',
                opacity: 0.6,
              }}>
                🦋
              </div>
            </div>

            <img
              src="/images/tutorial/ending.png"
              alt="Ending"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.9,
                zIndex: 2,
              }}
              onLoad={(e) => {
                // 이미지 로드 성공 시 나비 숨김
                const fallback = document.getElementById('fallback-emoji')
                if (fallback) fallback.style.display = 'none'
              }}
              onError={(e) => {
                // 이미지 로드 실패 시 이미지 숨김
                e.target.style.display = 'none'
              }}
            />

            {/* 빈티지 오버레이 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }} />
          </div>

          {/* 코너 장식 */}
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', color: '#c9a227', fontSize: '1.5rem' }}>❧</div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', color: '#c9a227', fontSize: '1.5rem', transform: 'scaleX(-1)' }}>❧</div>
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', color: '#c9a227', fontSize: '1.5rem', transform: 'scaleY(-1)' }}>❧</div>
          <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', color: '#c9a227', fontSize: '1.5rem', transform: 'scale(-1)' }}>❧</div>
        </div>

        {/* 명언 */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          maxWidth: '600px',
          opacity: showQuote ? 1 : 0,
          transform: showQuote ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1.2s ease-out',
        }}>
          <p style={{
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: '#e8d5b7',
            fontStyle: 'italic',
            lineHeight: 1.6,
            fontFamily: 'serif',
            textShadow: '0 2px 15px rgba(0,0,0,0.8)',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}>
            "I can't go back to yesterday — I was a different person then."
          </p>
          <p style={{
            marginTop: '0.8rem',
            fontSize: '0.85rem',
            color: 'rgba(201,162,39,0.6)',
            fontFamily: 'serif',
          }}>
            — Alice, in Wonderland
          </p>
          
          {/* 플레이어 타입 표시 */}
          {endingData?.playerType && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              background: 'rgba(201,162,39,0.1)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: '30px',
              display: 'inline-block',
            }}>
              <span style={{
                color: '#c9a227',
                fontSize: '1.1rem',
                fontFamily: 'serif',
              }}>
                {endingData.playerTypeEmoji} 당신은 "{endingData.playerType}"
              </span>
            </div>
          )}
        </div>

        {/* 다시 시작 버튼 */}
        <div style={{
          marginTop: '2.5rem',
          opacity: showButton ? 1 : 0,
          transform: showButton ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease-out',
        }}>
          <button
            onClick={handleRestart}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              fontFamily: 'serif',
              color: '#e8d5b7',
              background: 'transparent',
              border: '2px solid rgba(201,162,39,0.6)',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(201,162,39,0.15)'
              e.target.style.borderColor = '#c9a227'
              e.target.style.color = '#c9a227'
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = '0 0 30px rgba(201,162,39,0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(201,162,39,0.6)'
              e.target.style.color = '#e8d5b7'
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = 'none'
            }}
          >
            ✦ 다시 시작 ✦
          </button>
        </div>

        {/* 하단 장식 */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.85rem',
          fontStyle: 'italic',
        }}>
          Thank you for playing Wonderland Chess
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes floatDown {
          0% { 
            transform: translateY(-100vh) rotate(0deg); 
            opacity: 0; 
          }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0; 
          }
        }
        @keyframes snowfall {
          0% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
          }
          25% {
            transform: translateY(25vh) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(10px) rotate(270deg);
          }
          100% { 
            transform: translateY(110vh) translateX(0) rotate(360deg); 
          }
        }
        @keyframes starfall {
          0% { 
            transform: translateY(0) scale(1); 
            opacity: 0.3;
          }
          50% {
            transform: translateY(50vh) scale(1.2);
            opacity: 0.6;
          }
          100% { 
            transform: translateY(110vh) scale(1); 
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}