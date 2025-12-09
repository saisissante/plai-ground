'use client'
import React from 'react'

export default function ChessPiece({ type = 'pawn', position }) {
  const tileSize = 75
  const x = position?.x ?? 0
  const y = position?.y ?? 0

  // 체스판 칸 기준 위치
  const left = x * tileSize
  const top = y * tileSize

  const redGlass = {
    background:
      'linear-gradient(180deg, #ff9a9a 0%, #ff5c5c 35%, #d72626 70%, #7b0e0e 100%)',
    boxShadow:
      '0 14px 32px rgba(200,30,30,0.65), inset 0 6px 10px rgba(255,255,255,0.7)',
  }

  const basePlate = {
    width: 50,
    height: 18,
    borderRadius: '999px',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    ...redGlass,
  }

  const shadowStyle = {
    width: 58,
    height: 22,
    borderRadius: '999px',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.55)',
    filter: 'blur(6px)',
    opacity: 0.8,
  }

  // --- 기물별 디테일 ---

  const renderPawn = () => (
    <>
      {/* 몸통 */}
      <div
        style={{
          width: 34,
          height: 64,
          borderRadius: '20px',
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />
      {/* 머리 구 */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          position: 'absolute',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />
    </>
  )

  const renderRook = () => (
    <>
      {/* 몸통 기둥 */}
      <div
        style={{
          width: 34,
          height: 60,
          borderRadius: '14px',
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />
      {/* 윗부분 성벽 */}
      <div
        style={{
          width: 40,
          height: 16,
          borderRadius: '6px 6px 2px 2px',
          position: 'absolute',
          bottom: 74,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 4px',
          boxSizing: 'border-box',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              margin: '0 1px',
              borderRadius: '2px',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,120,120,0.9))',
            }}
          />
        ))}
      </div>
    </>
  )

  const renderBishop = () => (
    <>
      {/* 하단 벌브형 몸통 */}
      <div
        style={{
          width: 38,
          height: 56,
          borderRadius: '26px 26px 16px 16px',
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />
      {/* 위쪽 머리+홈 */}
      <div
        style={{
          width: 26,
          height: 34,
          borderRadius: '50px',
          position: 'absolute',
          bottom: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
          overflow: 'hidden',
        }}
      >
        {/* 대각선 홈 표현 */}
        <div
          style={{
            position: 'absolute',
            width: 4,
            height: 40,
            background: 'rgba(255,255,255,0.95)',
            transform: 'rotate(-35deg)',
            top: -6,
            right: 6,
            opacity: 0.9,
          }}
        />
      </div>
      {/* 꼭대기 작은 구 */}
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          position: 'absolute',
          bottom: 98,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />
    </>
  )

  const renderKnight = () => (
    <>
      {/* 하단 기둥 */}
      <div
        style={{
          width: 34,
          height: 36,
          borderRadius: '18px',
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />
      {/* 말 머리 실루엣 (굵은 곡선) */}
      <div
        style={{
          width: 40,
          height: 52,
          borderRadius: '26px 26px 10px 26px',
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-55%) skewX(-10deg)',
          ...redGlass,
        }}
      />
      {/* 귀/갈기 느낌 */}
      <div
        style={{
          width: 28,
          height: 34,
          borderRadius: '20px 4px 20px 4px',
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-10px)',
          background:
            'linear-gradient(160deg, #ffb3b3 0%, #e43a3a 50%, #5f0505 100%)',
        }}
      />
      {/* 입 부분 하이라이트 */}
      <div
        style={{
          width: 16,
          height: 10,
          borderRadius: '999px',
          position: 'absolute',
          bottom: 54,
          left: '50%',
          transform: 'translateX(10px)',
          background: 'rgba(255,255,255,0.85)',
          opacity: 0.7,
        }}
      />
    </>
  )

  const renderQueen = () => (
    <>
      {/* 메인 몸통 */}
      <div
        style={{
          width: 38,
          height: 70,
          borderRadius: '22px 22px 16px 16px',
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          ...redGlass,
        }}
      />

      {/* 왕관 링 */}
      <div
        style={{
          width: 42,
          height: 10,
          borderRadius: '999px',
          position: 'absolute',
          bottom: 84,
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(180deg, #ffe0e0, #ff8c8c, #c42323)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
      />

      {/* 왕관 톱니 */}
      {[-14, 0, 14].map((offset, i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 18,
            borderRadius: '50% 50% 4px 4px',
            position: 'absolute',
            bottom: 94,
            left: `calc(50% + ${offset}px)`,
            ...redGlass,
          }}
        />
      ))}
    </>
  )

  const renderPieceByType = () => {
    switch (type) {
      case 'rook':
        return renderRook()
      case 'bishop':
        return renderBishop()
      case 'knight':
        return renderKnight()
      case 'queen':
        return renderQueen()
      case 'pawn':
      default:
        return renderPawn()
    }
  }

  return (
    <div
      className="absolute"
      style={{
        left,
        top,
        width: tileSize,
        height: tileSize * 2, // 여유 공간
        transform: 'translateZ(40px)',
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
      }}
    >
      {/* 바닥 그림자 */}
      <div style={shadowStyle} />
      {/* 둥근 바닥판 */}
      <div style={basePlate} />
      {/* 타입별 몸체 */}
      {renderPieceByType()}
    </div>
  )
}
