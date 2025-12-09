'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TutorialIntro from '@/components/TutorialIntro'
import BackgroundParticles from '@/components/BackgroundParticles'

export default function Home() {
  const router = useRouter()
  const [showTutorial, setShowTutorial] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [showSecondPhase, setShowSecondPhase] = useState(false) // 두번째 단계 (확인하기 버튼)

  // 4초 후 또는 클릭 시 두번째 단계로
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondPhase(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleFirstClick = () => {
    if (!showSecondPhase) {
      setShowSecondPhase(true)
    }
  }

  const handleStartGame = () => {
    setFadeOut(true)
    setTimeout(() => {
      setShowTutorial(true)
    }, 800)
  }

  const handleTutorialComplete = () => {
    router.push('/game')
  }

  return (
    <>
      {/* 검은색 페이드 오버레이 - 항상 최상단 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        opacity: fadeOut ? 1 : 0,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: 'none',
        zIndex: 9998,
      }} />

      {showTutorial && (
        <TutorialIntro onComplete={handleTutorialComplete} />
      )}
      
      {!showTutorial && (
        <div 
          className="min-h-screen flex items-center justify-center animated-gradient relative overflow-hidden"
          onClick={handleFirstClick}
        >
          <BackgroundParticles />
        
        {/* 중앙 기준으로 원형 궤도를 도는 장식 요소들 - 더 큰 반경 */}
        <style jsx>{`
          @keyframes orbitLarge {
            from { transform: rotate(0deg) translateX(320px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(320px) rotate(-360deg); }
          }
        `}</style>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-6xl opacity-30" style={{ animation: 'orbitLarge 20s linear infinite', animationDelay: '0s' }}>
            🎩
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-5xl opacity-30" style={{ animation: 'orbitLarge 20s linear infinite', animationDelay: '-3.3s' }}>
            🐰
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-7xl opacity-30" style={{ animation: 'orbitLarge 20s linear infinite', animationDelay: '-6.6s' }}>
            ⏰
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-6xl opacity-30" style={{ animation: 'orbitLarge 20s linear infinite', animationDelay: '-10s' }}>
            🌹
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-5xl opacity-30" style={{ animation: 'orbitLarge 20s linear infinite', animationDelay: '-13.3s' }}>
            🃏
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-6xl opacity-30" style={{ animation: 'orbitLarge 20s linear infinite', animationDelay: '-16.6s' }}>
            🍄
          </div>
        </div>

        <div className="card text-center max-w-2xl fade-in card-entrance relative z-10">
          <h1 className="text-5xl wonderland-font mb-4 text-purple-800 drop-shadow-lg">
            Welcome to Wonderland
          </h1>
          <div className="text-6xl mb-4">🐇</div>
          <p className="text-lg mb-2 text-gray-700 leading-relaxed">
            추운 겨울 사무실 한켠,
          </p> 
          <p className="text-lg mb-6 text-gray-700">
            송년회 기획에 머리를 싸매던 당신의 시선 끝에..
          </p>
          
          {/* 시네마틱 이미지 스트립 - 필름처럼 길게 */}
          <div style={{
            width: 'calc(100% + 80px)',
            marginLeft: '-40px',
            height: '190px',
            margin: '1.5rem -40px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '2px',
            background: '#000',
          }}>
            {/* 상하 레터박스 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '25px',
              background: '#000',
              zIndex: 2,
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '25px',
              background: '#000',
              zIndex: 2,
            }} />
            
            {/* 이미지 */}
            <img 
              src="/images/tutorial/ending-blue.png"
              alt="Winter scene"
              style={{
                width: '98%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 8%',  // 세로 30% 위치
                opacity: 0.8,
              }}
            />
            
            {/* 비네트 효과 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
            }} />
          </div>
          
          {/* 두번째 단계 - 4초 후 또는 클릭 시 표시 */}
          <div style={{
            opacity: showSecondPhase ? 1 : 0,
            transform: showSecondPhase ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out',
            pointerEvents: showSecondPhase ? 'auto' : 'none',
          }}>
            <div className="text-sm mb-6 text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              창밖에 펄럭이는 빨간 망토…? ❄️🐇
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleStartGame()
              }}
              className="btn-primary text-xl px-10 py-4 pulse glow transform hover:scale-105 transition-all shadow-xl"
              style={{ marginTop: '0.5rem' }}
            >
              ✨ 확인하기
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  )
}