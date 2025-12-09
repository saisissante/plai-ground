'use client'

import { useState, useEffect } from 'react'

export default function CharacterDialogue({ 
  characterName, 
  characterEmoji, 
  text, 
  isGreeting = false,
  onTypingComplete 
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)
    
    let index = 0
    const typingSpeed = isGreeting ? 40 : 30

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
        onTypingComplete?.()
      }
    }, typingSpeed)

    return () => clearInterval(interval)
  }, [text, isGreeting, onTypingComplete])

  // 클릭하면 즉시 전체 텍스트 표시
  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(text)
      setIsTyping(false)
      onTypingComplete?.()
    }
  }

  return (
    <div 
      onClick={handleClick}
      style={{
        background: 'linear-gradient(135deg, rgba(30,20,40,0.95), rgba(20,15,30,0.98))',
        borderRadius: '16px',
        padding: '24px',
        border: '2px solid rgba(147, 51, 234, 0.3)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: isTyping ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 장식 */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 캐릭터 정보 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #9333ea, #db2777)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)',
        }}>
          {characterEmoji}
        </div>
        <div>
          <div style={{
            color: '#c9a227',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            letterSpacing: '1px',
          }}>
            {characterName}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.75rem',
          }}>
            {isGreeting ? '등장' : '질문 중...'}
          </div>
        </div>
      </div>

      {/* 대화 텍스트 */}
      <div style={{
        color: 'rgba(255,255,255,0.9)',
        fontSize: '1.1rem',
        lineHeight: '1.8',
        minHeight: '60px',
      }}>
        "{displayedText}"
        {isTyping && (
          <span style={{
            display: 'inline-block',
            width: '3px',
            height: '1.2em',
            background: '#c9a227',
            marginLeft: '4px',
            animation: 'blink 0.8s infinite',
            verticalAlign: 'middle',
          }} />
        )}
      </div>

      {/* 클릭 안내 */}
      {isTyping && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.7rem',
        }}>
          클릭하여 스킵
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}