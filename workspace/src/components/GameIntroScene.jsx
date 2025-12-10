'use client'

import { useState, useEffect, useRef } from 'react'

// UI만 담당하는 컴포넌트 (GameBoard는 부모에서 렌더링)
export default function GameIntroScene({ onStart }) {
  const [mounted, setMounted] = useState(false)
  const [showText, setShowText] = useState(false)
  const [textPhase, setTextPhase] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingRef = useRef(false)

  const introTexts = [
    "당신은 이상한 나라에 떨어졌습니다.",
    "체스판을 건너 원래의 세계로 돌아가야 합니다.",
    "내면의 거울을 따라가세요...",
    "그곳에서 당신이 누구인지 알게 될 것입니다.",
  ]

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setShowText(true)
    }, 500) // 보드가 이미 준비되어 있으므로 빠르게 시작
    return () => clearTimeout(timer)
  }, [])

  // 타이핑 효과
  useEffect(() => {
    if (!showText || textPhase >= introTexts.length) return
    if (typingRef.current) return
    
    typingRef.current = true
    const currentText = introTexts[textPhase]
    setIsTyping(true)
    setDisplayedText('')

    let index = 0
    const typeInterval = setInterval(() => {
      if (index < currentText.length) {
        setDisplayedText(currentText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        typingRef.current = false
        
        if (textPhase < introTexts.length - 1) {
          setTimeout(() => {
            setTextPhase(prev => prev + 1)
          }, 1500)
        }
      }
    }, 50)

    return () => {
      clearInterval(typeInterval)
      typingRef.current = false
    }
  }, [showText, textPhase])

  if (!mounted) return null

  return (
    <>
      {/* 그라데이션 오버레이 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,5,16,0.5) 60%, rgba(10,5,16,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* 상단 비네트 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(to bottom, rgba(10,5,16,0.9), transparent)',
        pointerEvents: 'none',
      }} />

      {/* 하단 비네트 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to top, rgba(10,5,16,0.95), transparent)',
        pointerEvents: 'none',
      }} />

      {/* 안내판 컨테이너 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 10,
      }}>
        {/* 고딕 프레임 안내판 */}
        <div style={{
          position: 'relative',
          maxWidth: '600px',
          width: '90%',
          padding: '3rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(20,10,30,0.92), rgba(10,5,20,0.95))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '2px solid rgba(201,162,39,0.7)',
          borderRadius: '12px',
          boxShadow: `
            0 0 40px rgba(201,162,39,0.15),
            0 0 80px rgba(147,51,234,0.1),
            inset 0 0 60px rgba(0,0,0,0.3)
          `,
          opacity: showText ? 1 : 0,
          transform: showText ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
          transition: 'all 1s ease-out',
        }}>
          {/* 코너 장식 */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#c9a227', fontSize: '1.5rem' }}>❧</div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#c9a227', fontSize: '1.5rem', transform: 'scaleX(-1)' }}>❧</div>
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#c9a227', fontSize: '1.5rem', transform: 'scaleY(-1)' }}>❧</div>
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#c9a227', fontSize: '1.5rem', transform: 'scale(-1)' }}>❧</div>

          {/* 상단 장식 */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 20px',
            background: 'linear-gradient(135deg, #2d1f14, #1a0f0a)',
            border: '2px solid #c9a227',
            borderRadius: '20px',
          }}>
            <span style={{ color: '#c9a227', fontSize: '1.2rem' }}>♠ ♥ ♦ ♣</span>
          </div>

          {/* 텍스트 영역 */}
          <div style={{
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            {/* 진행 표시 점들 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '1.5rem',
            }}>
              {introTexts.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index <= textPhase ? '#c9a227' : 'rgba(201,162,39,0.3)',
                    transition: 'all 0.5s',
                    boxShadow: index === textPhase ? '0 0 10px #c9a227' : 'none',
                  }}
                />
              ))}
            </div>

            {/* 메인 텍스트 */}
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
              color: '#e8d5b7',
              lineHeight: 1.8,
              fontFamily: 'serif',
              letterSpacing: '1px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              {displayedText}
              {isTyping && (
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1.2em',
                  backgroundColor: '#c9a227',
                  marginLeft: '2px',
                  animation: 'blink 0.8s infinite',
                  verticalAlign: 'text-bottom',
                }} />
              )}
            </p>
          </div>

          {/* 시작 버튼 */}
          {textPhase === introTexts.length - 1 && !isTyping && (
            <div style={{
              marginTop: '2rem',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out',
            }}>
              <button
                onClick={onStart}
                style={{
                  padding: '1rem 3rem',
                  fontSize: '1.3rem',
                  fontFamily: 'serif',
                  color: '#1a0f0a',
                  background: 'linear-gradient(135deg, #c9a227, #f4d03f, #c9a227)',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 30px rgba(201,162,39,0.5)',
                  transition: 'all 0.3s',
                  letterSpacing: '2px',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 8px 40px rgba(201,162,39,0.7)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 5px 30px rgba(201,162,39,0.5)'
                }}
              >
                ✦ 여정을 시작하다 ✦
              </button>

              <p style={{
                marginTop: '1rem',
                color: 'rgba(201,162,39,0.5)',
                fontSize: '0.85rem',
              }}>
                혹은 화면 아무 곳이나 클릭하세요
              </p>
            </div>
          )}
        </div>

        {/* 하단 장식 텍스트 */}
        <div style={{
          marginTop: '2rem',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          opacity: showText ? 1 : 0,
          transition: 'opacity 1s ease-out 0.5s',
        }}>
          "Curiouser and curiouser!" — Alice
        </div>
      </div>

      {/* 화면 클릭으로도 시작 가능 */}
      {textPhase === introTexts.length - 1 && !isTyping && (
        <div
          onClick={onStart}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'pointer',
            zIndex: 5,
          }}
        />
      )}

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}