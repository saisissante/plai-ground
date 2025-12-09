'use client'

import { useMemo } from 'react'

export default function ChessBoard({ currentPosition, encounterCount, onCellClick }) {
  // 8x8 체스판 생성
  const board = useMemo(() => {
    const cells = []
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const isLight = (x + y) % 2 === 0
        const isCurrent = currentPosition.x === x && currentPosition.y === y
        const isPast = (y < currentPosition.y) || (y === currentPosition.y && x < currentPosition.x)
        
        cells.push({
          x,
          y,
          isLight,
          isCurrent,
          isPast,
        })
      }
    }
    return cells
  }, [currentPosition])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2d2318, #1a1410)',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      border: '2px solid #8b7355',
    }}>
      {/* 제목 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '12px',
        color: '#c9a227',
        fontFamily: 'serif',
        fontSize: '0.9rem',
        letterSpacing: '2px',
      }}>
        ♟️ WONDERLAND CHESS ♟️
      </div>

      {/* 진행 상황 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '6px',
        fontSize: '0.85rem',
      }}>
        <span style={{ color: '#a0a0a0' }}>만남</span>
        <span style={{ color: '#c9a227' }}>{encounterCount} / 7</span>
      </div>

      {/* 체스판 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '2px',
        aspectRatio: '1',
        border: '3px solid #5c4a32',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => cell.isCurrent && onCellClick?.()}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              cursor: cell.isCurrent ? 'pointer' : 'default',
              transition: 'all 0.3s',
              position: 'relative',
              background: cell.isCurrent
                ? 'linear-gradient(135deg, #9333ea, #db2777)'
                : cell.isPast
                  ? cell.isLight ? '#4a4a4a' : '#3a3a3a'
                  : cell.isLight ? '#f0d9b5' : '#b58863',
              boxShadow: cell.isCurrent 
                ? 'inset 0 0 20px rgba(255,255,255,0.3), 0 0 10px rgba(147, 51, 234, 0.5)' 
                : 'none',
            }}
          >
            {cell.isCurrent && (
              <>
                {/* 앨리스 */}
                <span style={{ 
                  position: 'relative', 
                  zIndex: 2,
                  animation: 'bounce 1s ease-in-out infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}>
                  👧
                </span>
                {/* 글로우 효과 */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle, rgba(219,39,119,0.3) 0%, transparent 70%)',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
              </>
            )}
            {cell.isPast && (
              <span style={{ opacity: 0.3, fontSize: '0.8em' }}>
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '12px',
        fontSize: '0.75rem',
        color: '#888',
      }}>
        <span>👧 현재 위치</span>
        <span>✓ 지나온 길</span>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}