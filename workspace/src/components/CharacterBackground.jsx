'use client'

import { useState, useEffect, useMemo } from 'react'

// 캐릭터별 테마 설정
const CHARACTER_THEMES = {
  // 필수 캐릭터
  '비숍': {
    background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f0f23)',
    accentColor: '#4a90a4',
    frameColor: '#2d4a5e',
    goldColor: '#7eb8c9',
    image: '/images/characters/bishop.png',
    particles: ['✝️', '📿', '🕯️', '⚖️'],
    atmosphere: 'sacred', // 성스러운 분위기
  },
  '나이트': {
    background: 'linear-gradient(to bottom, #1a1a1a, #2d2d44, #1a1a2e)',
    accentColor: '#8b7355',
    frameColor: '#5c4a32',
    goldColor: '#c9a227',
    image: '/images/characters/knight.png',
    particles: ['⚔️', '🛡️', '🏰', '⚜️'],
    atmosphere: 'brave', // 용맹한 분위기
  },
  '레드퀸': {
    background: 'linear-gradient(to bottom, #2d0a0a, #4a1010, #1a0505)',
    accentColor: '#c41e3a',
    frameColor: '#8b0000',
    goldColor: '#ffd700',
    image: '/images/characters/red-queen.png',
    particles: ['👑', '♥️', '🌹', '💎'],
    atmosphere: 'royal', // 왕족의 위엄
  },
  // 선택 캐릭터
  '하얀토끼': {
    background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0, #c0c0c0)',
    accentColor: '#ff6b6b',
    frameColor: '#888888',
    goldColor: '#ffcc00',
    image: '/images/characters/white-rabbit.png',
    particles: ['🐰', '⏰', '🥕', '⌚'],
    atmosphere: 'hurried', // 바쁜 분위기
  },
  '체셔고양이': {
    background: 'linear-gradient(to bottom, #2e1065, #4c1d95, #1e1b4b)',
    accentColor: '#a855f7',
    frameColor: '#6b21a8',
    goldColor: '#e879f9',
    image: '/images/characters/cheshire-cat.png',
    particles: ['😸', '🌙', '✨', '🎭'],
    atmosphere: 'mysterious', // 신비로운 분위기
  },
  '모자장수': {
    background: 'linear-gradient(to bottom, #1e3a1e, #2d5a2d, #0f1f0f)',
    accentColor: '#22c55e',
    frameColor: '#166534',
    goldColor: '#fbbf24',
    image: '/images/characters/mad-hatter.png',
    particles: ['🎩', '🫖', '☕', '🃏'],
    atmosphere: 'whimsical', // 기발한 분위기
  },
  '애벌레': {
    background: 'linear-gradient(to bottom, #0c4a6e, #0369a1, #082f49)',
    accentColor: '#06b6d4',
    frameColor: '#155e75',
    goldColor: '#67e8f9',
    image: '/images/characters/caterpillar.png',
    particles: ['🐛', '🍄', '💨', '🦋'],
    atmosphere: 'dreamy', // 몽환적 분위기
  },
  '트위들디와 트위들덤': {
    background: 'linear-gradient(to bottom, #431407, #7c2d12, #1c0a00)',
    accentColor: '#f97316',
    frameColor: '#9a3412',
    goldColor: '#fdba74',
    image: '/images/characters/tweedle.png',
    particles: ['👯', '🪞', '🎪', '🎭'],
    atmosphere: 'playful', // 장난스러운 분위기
  },
  '도도새': {
    background: 'linear-gradient(to bottom, #1e3a5f, #2563eb, #1e40af)',
    accentColor: '#3b82f6',
    frameColor: '#1d4ed8',
    goldColor: '#93c5fd',
    image: '/images/characters/dodo.png',
    particles: ['🦤', '🏆', '🎯', '🏅'],
    atmosphere: 'competitive', // 경쟁적 분위기
  },
}

// 기본 테마 (알 수 없는 캐릭터용)
const DEFAULT_THEME = {
  background: 'linear-gradient(to bottom, #0a0a0a, #1a0a20, #0a0a0a)',
  accentColor: '#9333ea',
  frameColor: '#5c4a32',
  goldColor: '#c9a227',
  image: '/images/characters/default.png',
  particles: ['✨', '🌟', '⭐', '💫'],
  atmosphere: 'magical',
}

export default function CharacterBackground({ characterName, characterEmoji, children }) {
  const [mounted, setMounted] = useState(false)
  
  const theme = CHARACTER_THEMES[characterName] || DEFAULT_THEME

  // 클라이언트에서만 파티클 생성
  const particles = useMemo(() => {
    if (!mounted) return []
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      emoji: theme.particles[Math.floor(Math.random() * theme.particles.length)],
      size: 0.8 + Math.random() * 0.8,
    }))
  }, [mounted, theme.particles])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: theme.background,
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {/* 분위기별 추가 효과 */}
      {theme.atmosphere === 'sacred' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top, rgba(74,144,164,0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
      )}
      
      {theme.atmosphere === 'royal' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(196,30,58,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      {theme.atmosphere === 'mysterious' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(168,85,247,0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
      )}

      {/* 캐릭터 이미지 (있을 경우) */}
      {theme.image && (
        <div style={{
          position: 'absolute',
          right: '-5%',
          bottom: '-10%',
          width: '50%',
          height: '80%',
          opacity: 0.15,
          backgroundImage: `url(${theme.image})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          filter: 'blur(1px)',
        }} />
      )}

      {/* 떨어지는 파티클 */}
      {mounted && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                fontSize: `${p.size}rem`,
                opacity: 0.4,
                animation: `float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      {/* 고딕 프레임 장식 (코너) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '60px',
        height: '60px',
        borderTop: `3px solid ${theme.goldColor}`,
        borderLeft: `3px solid ${theme.goldColor}`,
        opacity: 0.6,
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: theme.goldColor,
          fontSize: '1.2rem',
        }}>❧</div>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderTop: `3px solid ${theme.goldColor}`,
        borderRight: `3px solid ${theme.goldColor}`,
        opacity: 0.6,
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: theme.goldColor,
          fontSize: '1.2rem',
          transform: 'scaleX(-1)',
        }}>❧</div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '60px',
        height: '60px',
        borderBottom: `3px solid ${theme.goldColor}`,
        borderLeft: `3px solid ${theme.goldColor}`,
        opacity: 0.6,
      }}>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          color: theme.goldColor,
          fontSize: '1.2rem',
          transform: 'scaleY(-1)',
        }}>❧</div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderBottom: `3px solid ${theme.goldColor}`,
        borderRight: `3px solid ${theme.goldColor}`,
        opacity: 0.6,
      }}>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          color: theme.goldColor,
          fontSize: '1.2rem',
          transform: 'scale(-1)',
        }}>❧</div>
      </div>

      {/* 캐릭터 이름 표시 (상단 중앙) */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 24px',
        background: `linear-gradient(135deg, ${theme.frameColor}, rgba(0,0,0,0.8))`,
        border: `2px solid ${theme.goldColor}`,
        borderRadius: '8px',
        boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 20px ${theme.accentColor}33`,
        zIndex: 10,
      }}>
        <span style={{
          color: theme.goldColor,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          letterSpacing: '2px',
          textShadow: `0 0 10px ${theme.accentColor}`,
        }}>
          {characterEmoji} {characterName}
        </span>
      </div>

      {/* 비네트 효과 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* 컨텐츠 */}
      <div style={{ position: 'relative', zIndex: 5, height: '100%' }}>
        {children}
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-20px) rotate(10deg); 
            opacity: 0.6;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}