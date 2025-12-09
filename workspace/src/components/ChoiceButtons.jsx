'use client'

import { useState } from 'react'

export default function ChoiceButtons({ choices, onSelect, disabled = false }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const handleSelect = (choice) => {
    if (disabled || selectedId) return
    setSelectedId(choice.id)
    
    // 약간의 딜레이 후 선택 처리
    setTimeout(() => {
      onSelect(choice)
    }, 500)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '20px',
    }}>
      {choices.map((choice, index) => {
        const isSelected = selectedId === choice.id
        const isHovered = hoveredId === choice.id
        const isDisabled = disabled || (selectedId && !isSelected)

        return (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice)}
            onMouseEnter={() => setHoveredId(choice.id)}
            onMouseLeave={() => setHoveredId(null)}
            disabled={isDisabled}
            style={{
              padding: '16px 24px',
              borderRadius: '12px',
              border: isSelected 
                ? '2px solid #c9a227'
                : '2px solid rgba(147, 51, 234, 0.3)',
              background: isSelected
                ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.2), rgba(147, 51, 234, 0.2))'
                : isHovered
                  ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.1))'
                  : 'rgba(30, 20, 40, 0.8)',
              color: isDisabled && !isSelected 
                ? 'rgba(255,255,255,0.3)' 
                : 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              textAlign: 'left',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered && !isDisabled ? 'translateX(8px)' : 'translateX(0)',
              boxShadow: isSelected 
                ? '0 0 20px rgba(201, 162, 39, 0.3)'
                : isHovered 
                  ? '0 4px 20px rgba(147, 51, 234, 0.3)'
                  : 'none',
              position: 'relative',
              overflow: 'hidden',
              animation: `fadeInUp 0.4s ease forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
            }}
          >
            {/* 선택 인디케이터 */}
            <span style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: `2px solid ${isSelected ? '#c9a227' : 'rgba(147, 51, 234, 0.5)'}`,
              marginRight: '12px',
              verticalAlign: 'middle',
              position: 'relative',
              transition: 'all 0.3s',
              background: isSelected ? '#c9a227' : 'transparent',
            }}>
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#1a1410',
                  fontWeight: 'bold',
                }}>
                  ✓
                </span>
              )}
            </span>

            {/* 선택지 텍스트 */}
            <span style={{ verticalAlign: 'middle' }}>
              {choice.text}
            </span>

            {/* 호버 시 화살표 */}
            {isHovered && !isDisabled && (
              <span style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#c9a227',
              }}>
                →
              </span>
            )}

            {/* 선택 완료 이펙트 */}
            {isSelected && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.1), transparent)',
                animation: 'shimmer 1s ease',
              }} />
            )}
          </button>
        )
      })}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}