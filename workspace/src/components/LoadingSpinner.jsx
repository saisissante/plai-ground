'use client'

export default function LoadingSpinner({ message = '이상한 나라를 탐험 중...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '20px',
    }}>
      {/* 회전하는 체스 말들 */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
      }}>
        {['♟️', '♞', '♝', '♜'].map((piece, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              fontSize: '1.5rem',
              animation: `orbit 2s linear infinite`,
              animationDelay: `${index * 0.5}s`,
              transformOrigin: '40px 40px',
            }}
          >
            {piece}
          </div>
        ))}
        
        {/* 중앙 글로우 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,51,234,0.6) 0%, transparent 70%)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </div>

      {/* 메시지 */}
      <div style={{
        color: 'rgba(255,255,255,0.7)',
        fontSize: '1rem',
        animation: 'fadeInOut 2s ease-in-out infinite',
      }}>
        {message}
      </div>

      {/* 점 애니메이션 */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#c9a227',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}