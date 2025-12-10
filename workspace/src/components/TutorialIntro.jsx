'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import GameIntroScene from '@/components/GameIntroScene'

const scenes = [
  {
    id: 1,
    image: '/images/tutorial/scene1.png',
    text: '눈 내리는 창밖, 산타 옷을 입은 토끼가 시계를 보며 바쁘게 뛰어간다.',
    emoji: '🐇❄️',
  },
  {
    id: 2,
    image: '/images/tutorial/scene2.png',
    text: '호기심을 참지 못한 당신, 토끼의 뒷모습을 쫓아 달려간다.',
    emoji: '🏃‍♀️✨',
  },
  {
    id: 3,
    image: '/images/tutorial/scene3.png',
    text: '어둑한 토끼굴 입구... 발을 헛디뎠다!',
    emoji: '🕳️😱',
  },
  {
    id: 4,
    image: '/images/tutorial/scene4.png',
    text: '끝없이 떨어진다. 흔들의자에 앉은 채로, 신비한 공간 속으로...',
    emoji: '🪑🌀',
  },
  {
    id: 5,
    image: '/images/tutorial/scene5.png',
    text: '눈앞에 놓인 탁자. 그 위의 유리병을 조심스레 들어본다.',
    emoji: '🧪✨',
  },
]

export default function TutorialIntro({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0)
  const [showText, setShowText] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [fadeIn, setFadeIn] = useState(false) // 페이드 인 효과
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [textTyped, setTextTyped] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showGameIntro, setShowGameIntro] = useState(false) // 3D 인트로 씬 표시 여부
  const typingRef = useRef(false) // 타이핑 중복 방지
  const [imagesLoaded, setImagesLoaded] = useState(false) // 이미지 로드 상태

  // 이미지 프리로드
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = scenes.map(scene => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = scene.image
          img.onload = resolve
          img.onerror = resolve // 에러가 나도 계속 진행
        })
      })
      
      await Promise.all(imagePromises)
      setImagesLoaded(true)
      // 이미지 로드 완료 후 페이드 인 시작
      setTimeout(() => setFadeIn(true), 300)
    }
    
    preloadImages()
  }, [])

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true)
  }, [])

  const [timeLeft, setTimeLeft] = useState(7)
  const [timerActive, setTimerActive] = useState(false)
  const [reactionText, setReactionText] = useState('') // 선택 후 속마음 텍스트
  const [reactionEmoji, setReactionEmoji] = useState('') // 선택 후 이모지

  // 타이머 시작 (이름 입력 화면이 보일 때)
  useEffect(() => {
    if (showNameInput && !nameSubmitted) {
      setTimerActive(true)
      setTimeLeft(7)
    }
  }, [showNameInput, nameSubmitted])

  // 타이머 카운트다운
  useEffect(() => {
    if (!timerActive || nameSubmitted) return

    if (timeLeft <= 0) {
      // 시간 초과 - "미끄러졌다" 선택
      handleSlipChoice()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, timerActive, nameSubmitted])

  // 선택 처리 함수들
  const handleDrinkChoice = () => {
    if (nameSubmitted) return
    setNameSubmitted(true)
    setTimerActive(false)
    setReactionEmoji('😋')
    setReactionText('꿀꺽꿀꺽... 맛있당!')
    if (typeof window !== 'undefined') {
      localStorage.setItem('drinkChoice', 'yes')
    }
    setTimeout(() => {
      setShowGameIntro(true)
    }, 2000)
  }

  const handleNoChoice = () => {
    if (nameSubmitted) return
    setNameSubmitted(true)
    setTimerActive(false)
    setReactionEmoji('😤')
    setReactionText('흥, 뭔지 알고 마셔야지!')
    if (typeof window !== 'undefined') {
      localStorage.setItem('drinkChoice', 'no')
    }
    setTimeout(() => {
      setShowGameIntro(true)
    }, 2000)
  }

  const handleSlipChoice = () => {
    if (nameSubmitted) return
    setNameSubmitted(true)
    setTimerActive(false)
    setReactionEmoji('😱')
    setReactionText('헉...! 미끄러졌다...!')
    if (typeof window !== 'undefined') {
      localStorage.setItem('drinkChoice', 'slip')
    }
    setTimeout(() => {
      setShowGameIntro(true)
    }, 2000)
  }

  // 파티클 데이터 (클라이언트에서만 생성)
  const nameInputParticles = useMemo(() => {
    if (!mounted) return []
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5,
      emoji: ['✨', '🌟', '⭐', '🃏', '🎴'][Math.floor(Math.random() * 5)]
    }))
  }, [mounted])

  const sceneParticles = useMemo(() => {
    if (!mounted) return []
    return [...Array(10)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 8,
      emoji: ['✨', '🍂', '🌙', '⭐'][Math.floor(Math.random() * 4)]
    }))
  }, [mounted])

  // 타이핑 효과
  useEffect(() => {
    if (currentScene < scenes.length && showText) {
      if (typingRef.current) return // 이미 타이핑 중이면 무시
      
      typingRef.current = true
      const fullText = scenes[currentScene].text
      setTextTyped('')
      setIsTyping(true)
      
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setTextTyped(fullText.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          typingRef.current = false
          clearInterval(typingInterval)
        }
      }, 50)

      return () => {
        clearInterval(typingInterval)
        typingRef.current = false
      }
    }
  }, [currentScene, showText])

  // 장면 전환 로직
  useEffect(() => {
    if (currentScene >= scenes.length) return

    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 500)

    return () => clearTimeout(textTimer)
  }, [currentScene])

  // 다음 장면으로
  const goToNextScene = useCallback(() => {
    if (isTyping) {
      setTextTyped(scenes[currentScene].text)
      setIsTyping(false)
      return
    }

    setFadeOut(true)
    
    setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1)
        setShowText(false)
        setFadeOut(false)
      } else {
        setShowNameInput(true)
        setFadeOut(false)
      }
    }, 500)
  }, [currentScene, isTyping])

  // 클릭 또는 키보드로 진행
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showNameInput) return
      if (e.key === 'Enter' || e.key === ' ') {
        goToNextScene()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNextScene, showNameInput])

  // 이름 제출
  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (playerName.trim()) {
      setNameSubmitted(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('playerName', playerName.trim())
      }
      setTimeout(() => {
        onComplete()
      }, 1500)
    }
  }

  // 3D 게임 인트로 씬
  if (showGameIntro) {
    return <GameIntroScene onStart={onComplete} />
  }

  // 이름 입력 화면
  if (showNameInput) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 선택 후 속마음 표시 */}
        {nameSubmitted && reactionText && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease-out',
              zIndex: 10,
            }}
          >
            <div style={{
              fontSize: 'clamp(4rem, 15vw, 8rem)',
              marginBottom: '1rem',
              animation: 'bounce 0.6s ease-out',
            }}>
              {reactionEmoji}
            </div>
            <div 
              className="wonderland-font"
              style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                color: '#e8d5b7',
                textAlign: 'center',
                textShadow: '0 0 20px rgba(201,162,39,0.5)',
                animation: 'fadeInUp 0.6s ease-out 0.2s both',
              }}
            >
              {reactionText}
            </div>
          </div>
        )}

        <div 
          style={{
            textAlign: 'center',
            transition: 'all 0.8s',
            opacity: nameSubmitted ? 0 : 1,
            transform: nameSubmitted ? 'scale(0.9)' : 'scale(1)',
            pointerEvents: nameSubmitted ? 'none' : 'auto',
          }}
        >
          {/* 흔들리는 파티클 효과 */}
          <style>{`
            @keyframes gentleSway {
              0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
              25% { transform: translateX(8px) translateY(-5px) rotate(3deg); }
              50% { transform: translateX(0) translateY(3px) rotate(-2deg); }
              75% { transform: translateX(-8px) translateY(-3px) rotate(2deg); }
            }
          `}</style>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {nameInputParticles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  fontSize: '1.5rem',
                  left: p.left,
                  top: `${20 + (p.id * 15) % 60}%`,
                  opacity: 0.4,
                  animation: `gentleSway ${2 + p.delay}s ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              >
                {p.emoji}
              </div>
            ))}
          </div>

          {/* 질문 */}
          <div style={{ marginBottom: '3rem' }}>
            <span 
              className="wonderland-font"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                background: 'linear-gradient(to right, #c084fc, #f472b6, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
              }}
            >
              "마실까...?"
            </span>
          </div>

          {/* 타이머 표시 */}
          <div style={{
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 30px',
              background: timeLeft <= 3 ? 'rgba(220,38,38,0.2)' : 'rgba(147,51,234,0.2)',
              border: `2px solid ${timeLeft <= 3 ? 'rgba(220,38,38,0.5)' : 'rgba(147,51,234,0.3)'}`,
              borderRadius: '30px',
              transition: 'all 0.3s',
            }}>
              <span style={{
                fontSize: '1.5rem',
                color: timeLeft <= 3 ? '#fca5a5' : 'rgba(255,255,255,0.7)',
                fontFamily: 'monospace',
              }}>
                ⏰ {timeLeft}
              </span>
            </div>
            {timeLeft <= 3 && (
              <div style={{
                marginTop: '8px',
                color: '#fca5a5',
                fontSize: '0.85rem',
                animation: 'pulse 0.5s ease-in-out infinite',
              }}>
                서두르세요...!
              </div>
            )}
          </div>

          {/* 선택 버튼 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}>
            <button
              onClick={handleDrinkChoice}
              disabled={nameSubmitted}
              style={{
                padding: '1.2rem 3rem',
                fontSize: '1.5rem',
                borderRadius: '9999px',
                background: 'linear-gradient(to right, #9333ea, #db2777, #9333ea)',
                color: 'white',
                border: 'none',
                cursor: nameSubmitted ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 30px rgba(219, 39, 119, 0.4)',
                minWidth: '250px',
                opacity: nameSubmitted ? 0.5 : 1,
              }}
              className="wonderland-font"
              onMouseOver={(e) => {
                if (!nameSubmitted) {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 15px 40px rgba(219, 39, 119, 0.6)'
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 10px 30px rgba(219, 39, 119, 0.4)'
              }}
            >
              🍷 마신다
            </button>

            <button
              onClick={handleNoChoice}
              disabled={nameSubmitted}
              style={{
                padding: '1.2rem 3rem',
                fontSize: '1.5rem',
                borderRadius: '9999px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: nameSubmitted ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                minWidth: '250px',
                opacity: nameSubmitted ? 0.5 : 1,
              }}
              className="wonderland-font"
              onMouseOver={(e) => {
                if (!nameSubmitted) {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.6)'
                  e.target.style.color = 'rgba(255,255,255,0.9)'
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                e.target.style.color = 'rgba(255,255,255,0.7)'
              }}
            >
              🚫 안 마신다
            </button>

            <button
              onClick={handleSlipChoice}
              disabled={nameSubmitted}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.2rem',
                borderRadius: '9999px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.4)',
                border: '2px dashed rgba(255,255,255,0.2)',
                cursor: nameSubmitted ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                minWidth: '250px',
                opacity: nameSubmitted ? 0.5 : 1,
                marginTop: '0.5rem',
              }}
              className="wonderland-font"
              onMouseOver={(e) => {
                if (!nameSubmitted) {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.borderColor = 'rgba(100,149,237,0.5)'
                  e.target.style.color = 'rgba(100,149,237,0.8)'
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                e.target.style.color = 'rgba(255,255,255,0.4)'
              }}
            >
              💫 아이쿠, 미끄러졌다!
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 씬 슬라이드쇼
  const scene = currentScene < scenes.length ? scenes[currentScene] : null

  // 씬이 없으면 (이름 입력 단계 등) 빈 화면 방지
  if (!scene && !showNameInput && !showGameIntro) {
    return null
  }

  return (
    <div 
      onClick={goToNextScene}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 9999,
        cursor: 'pointer',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.8s ease-in',
      }}
    >
      {/* 검정 배경 레이어 - 항상 유지 */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000',
          zIndex: 0,
        }}
      />
      
      {/* 컨텐츠 레이어 - 페이드 효과 적용 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'opacity 0.5s',
          opacity: fadeOut ? 0 : 1,
          zIndex: 1,
        }}
      >
      {/* 배경 */}
      <div style={{ 
        position: 'absolute', 
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e, #0a0a0a)',
      }}>
        {/* 고딕 액자 프레임 */}
        <div style={{
          position: 'relative',
          width: 'min(80vw, 600px)',
          height: 'min(60vh, 450px)',
        }}>
          {/* 외곽 장식 프레임 */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            border: '4px solid #8b7355',
            borderRadius: '8px',
            boxShadow: `
              inset 0 0 20px rgba(0,0,0,0.8),
              0 0 40px rgba(0,0,0,0.9),
              0 0 80px rgba(139,115,85,0.3)
            `,
            background: 'linear-gradient(135deg, #2d2318 0%, #1a1410 50%, #2d2318 100%)',
          }}>
            {/* 코너 장식 - 좌상 */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              width: '40px',
              height: '40px',
              borderTop: '3px solid #c9a227',
              borderLeft: '3px solid #c9a227',
              borderTopLeftRadius: '8px',
            }}>
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                fontSize: '16px',
                color: '#c9a227',
              }}>❧</div>
            </div>
            {/* 코너 장식 - 우상 */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '40px',
              height: '40px',
              borderTop: '3px solid #c9a227',
              borderRight: '3px solid #c9a227',
              borderTopRightRadius: '8px',
            }}>
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '16px',
                color: '#c9a227',
                transform: 'scaleX(-1)',
              }}>❧</div>
            </div>
            {/* 코너 장식 - 좌하 */}
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '-8px',
              width: '40px',
              height: '40px',
              borderBottom: '3px solid #c9a227',
              borderLeft: '3px solid #c9a227',
              borderBottomLeftRadius: '8px',
            }}>
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                fontSize: '16px',
                color: '#c9a227',
                transform: 'scaleY(-1)',
              }}>❧</div>
            </div>
            {/* 코너 장식 - 우하 */}
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              right: '-8px',
              width: '40px',
              height: '40px',
              borderBottom: '3px solid #c9a227',
              borderRight: '3px solid #c9a227',
              borderBottomRightRadius: '8px',
            }}>
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                fontSize: '16px',
                color: '#c9a227',
                transform: 'scale(-1)',
              }}>❧</div>
            </div>
          </div>

          {/* 내부 프레임 */}
          <div style={{
            position: 'absolute',
            inset: '0',
            border: '8px solid',
            borderImage: 'linear-gradient(135deg, #5c4a32, #3d2e1f, #5c4a32, #2a1f14) 1',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
          }}>
            {/* 이미지 */}
            {scene && imagesLoaded && (
            <img 
              src={scene.image}
              alt={`Scene ${scene.id}`}
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'sepia(15%) contrast(1.1)',
              }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            )}
            
            {/* 이미지 로드 실패 시 폴백 */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, #1a1520, #0d0a10)',
                zIndex: -1,
              }}
            >
              <div style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }}>
                {scene?.emoji?.split('').map((char, i) => (
                  <span 
                    key={i} 
                    style={{
                      display: 'inline-block',
                      animation: `bounce 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* 빈티지 오버레이 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* 액자 하단 명패 */}
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 24px',
            background: 'linear-gradient(135deg, #3d2e1f, #2a1f14)',
            border: '2px solid #8b7355',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}>
            <span style={{
              fontFamily: 'serif',
              fontSize: '0.85rem',
              color: '#c9a227',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              Chapter {scene?.id || ''}
            </span>
          </div>
        </div>

        {/* 배경 장식 - 떨어지는 파티클 */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.3 }}>
          {sceneParticles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                fontSize: '1.5rem',
                left: p.left,
                animation: `floatDown ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* 진행 표시 */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.75rem',
        zIndex: 20,
      }}>
        {scenes.map((_, index) => (
          <div
            key={index}
            style={{
              width: '0.75rem',
              height: '0.75rem',
              borderRadius: '50%',
              transition: 'all 0.5s',
              backgroundColor: index === currentScene 
                ? '#fff' 
                : index < currentScene 
                  ? 'rgba(255,255,255,0.6)' 
                  : 'rgba(255,255,255,0.2)',
              transform: index === currentScene ? 'scale(1.25)' : 'scale(1)',
              boxShadow: index === currentScene ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {/* 하단 텍스트 박스 */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
          transition: 'all 0.7s',
          transform: showText ? 'translateY(0)' : 'translateY(100%)',
          opacity: showText ? 1 : 0,
        }}
      >
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          {/* 텍스트 박스 */}
          <div 
            style={{
              position: 'relative',
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '1rem',
              padding: 'clamp(1rem, 4vw, 2rem)',
              boxShadow: '0 25px 50px rgba(88, 28, 135, 0.5)',
            }}
          >
            {/* 장식 코너 */}
            <div style={{ position: 'absolute', top: '-8px', left: '-8px', width: '24px', height: '24px', borderTop: '2px solid #fbbf24', borderLeft: '2px solid #fbbf24' }} />
            <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderTop: '2px solid #fbbf24', borderRight: '2px solid #fbbf24' }} />
            <div style={{ position: 'absolute', bottom: '-8px', left: '-8px', width: '24px', height: '24px', borderBottom: '2px solid #fbbf24', borderLeft: '2px solid #fbbf24' }} />
            <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '24px', height: '24px', borderBottom: '2px solid #fbbf24', borderRight: '2px solid #fbbf24' }} />

            {/* 텍스트 */}
            <p 
              className="wonderland-font"
              style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.6,
                textAlign: 'center',
                margin: 0,
              }}
            >
              {textTyped}
              {isTyping && (
                <span 
                  style={{
                    display: 'inline-block',
                    width: '4px',
                    height: '1.5em',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    marginLeft: '4px',
                    animation: 'blink 0.8s infinite',
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </p>

            {/* 클릭 안내 */}
            {!isTyping && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-3rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.875rem',
                  animation: 'pulse 2s infinite',
                  whiteSpace: 'nowrap',
                }}
              >
                클릭하거나 Enter를 눌러 계속...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 장면 번호 */}
      <div 
        className="wonderland-font"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '1.125rem',
        }}
      >
        {currentScene + 1} / {scenes.length}
      </div>
      </div>{/* 컨텐츠 레이어 닫기 */}

      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes bounce {
          0% { transform: scale(0) rotate(-10deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes floatDown {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes gentleSway {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(8px) translateY(-5px) rotate(3deg); }
          50% { transform: translateX(0) translateY(3px) rotate(-2deg); }
          75% { transform: translateX(-8px) translateY(-3px) rotate(2deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
    </div>
  )
}