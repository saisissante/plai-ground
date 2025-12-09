'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useGameStore from '@/state/useGameStore'
import ChessBoard from '@/components/ChessBoard'
import CharacterDialogue from '@/components/CharacterDialogue'
import ChoiceButtons from '@/components/ChoiceButtons'
import LoadingSpinner from '@/components/LoadingSpinner'
import EndingScreen from '@/components/EndingScreen'
import CharacterBackground from '@/components/CharacterBackground'

// 캐릭터별 원작 명대사 (영어 원전)
const CHARACTER_QUOTES = {
  '비숍': "Consider what a great girl you are. Consider what a long way you've come today.",
  '나이트': "It's my own invention.",
  '레드퀸': "Off with their heads!",
  '하얀토끼': "Oh dear! Oh dear! I shall be too late!",
  '체셔고양이': "We're all mad here.",
  '모자장수': "Why is a raven like a writing-desk?",
  '애벌레': "Who are you?",
  '트위들디와 트위들덤': "Contrariwise, if it was so, it might be; and if it were so, it would be; but as it isn't, it ain't.",
  '도도새': "Everybody has won, and all must have prizes!",
}

export default function GamePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true)
  const [typingComplete, setTypingComplete] = useState(false)
  
  const {
    gamePhase,
    encounterCount,
    currentPosition,
    currentEncounter,
    currentQuestionIndex,
    gameHistory,
    endingData,
    isLoading,
    error,
    drinkChoice,
    setDrinkChoice,
    startGame,
    startEncounter,
    selectChoice,
    generateEnding,
    resetGame,
  } = useGameStore()

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true)
  }, [])

  // 초기화: localStorage에서 drinkChoice 가져오기
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedChoice = localStorage.getItem('drinkChoice')
      if (savedChoice && !drinkChoice) {
        setDrinkChoice(savedChoice)
      }
    }
  }, [mounted, drinkChoice, setDrinkChoice])

  // 게임 시작 시 자동으로 첫 만남
  useEffect(() => {
    if (mounted && gamePhase === 'playing' && !currentEncounter && !isLoading) {
      startEncounter()
    }
  }, [mounted, gamePhase, currentEncounter, isLoading, startEncounter])

  // 엔딩 페이즈에서 엔딩 생성
  useEffect(() => {
    if (mounted && gamePhase === 'ending' && !endingData && !isLoading) {
      generateEnding()
    }
  }, [mounted, gamePhase, endingData, isLoading, generateEnding])

  // 만남 시작 시 greeting 표시 리셋
  useEffect(() => {
    if (currentEncounter) {
      setShowGreeting(true)
      setTypingComplete(false)
    }
  }, [currentEncounter?.encounterNumber])

  // 게임 시작 전 (intro 페이지로 리다이렉트)
  useEffect(() => {
    if (mounted && gamePhase === 'intro') {
      // 튜토리얼을 마쳤으면 게임 시작
      if (drinkChoice) {
        startGame()
      }
    }
  }, [mounted, gamePhase, drinkChoice, startGame])

  // 현재 질문
  const currentQuestion = currentEncounter?.questions?.[currentQuestionIndex]

  // 선택 처리
  const handleChoice = (choice) => {
    setTypingComplete(false)
    selectChoice(choice)
  }

  // 재시작
  const handleRestart = () => {
    resetGame()
    localStorage.removeItem('drinkChoice')
    router.push('/')
  }

  // 클라이언트 마운트 전 로딩 표시
  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #0a0a0a, #1a0a20)',
      }}>
        <LoadingSpinner message="게임을 불러오는 중..." />
      </div>
    )
  }

  // 엔딩 화면
  if (gamePhase === 'ending') {
    if (isLoading) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #0a0a0a, #1a0a20)',
        }}>
          <LoadingSpinner message="당신의 여정을 되돌아보는 중..." />
          
          {/* 레드퀸 인용구 */}
          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
            padding: '0 2rem',
          }}>
            <p style={{
              color: 'rgba(201,162,39,0.4)',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontFamily: 'serif',
            }}>
              "If you want to get somewhere else, you must run at least twice as fast as that!"
            </p>
            <p style={{
              color: 'rgba(201,162,39,0.3)',
              fontSize: '0.85rem',
              marginTop: '0.5rem',
            }}>
              — The Red Queen 👑
            </p>
          </div>
        </div>
      )
    }
    
    return <EndingScreen endingData={endingData} onRestart={handleRestart} />
  }

  // 직전에 만난 캐릭터의 명대사 가져오기
  const lastCharacterQuote = useMemo(() => {
    if (!mounted || gameHistory.length === 0) return null
    
    // gameHistory에서 마지막 캐릭터 찾기
    const lastEntry = gameHistory[gameHistory.length - 1]
    if (!lastEntry?.character) return null
    
    const charName = lastEntry.character
    return CHARACTER_QUOTES[charName] || null
  }, [mounted, gameHistory])

  // 로딩 중
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #0a0a0a, #1a0a20)',
      }}>
        <LoadingSpinner message="새로운 만남을 준비 중..." />
        
        {/* 직전 캐릭터 명대사 */}
        {lastCharacterQuote && (
          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
            padding: '0 2rem',
          }}>
            <p style={{
              color: 'rgba(201,162,39,0.4)',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontFamily: 'serif',
            }}>
              "{lastCharacterQuote}"
            </p>
          </div>
        )}
      </div>
    )
  }

  // 에러 처리
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #0a0a0a, #1a0a20)',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>😵</div>
        <h2 style={{ marginBottom: '10px' }}>이런, 뭔가 잘못됐어요!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#9333ea',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <>
      {/* 캐릭터별 테마 배경 */}
      {currentEncounter && (
        <CharacterBackground 
          characterName={currentEncounter.characterName}
          characterEmoji={currentEncounter.characterEmoji}
        />
      )}
      
      <div style={{
        minHeight: '100vh',
        background: currentEncounter ? 'transparent' : 'linear-gradient(to bottom, #0a0a0a, #1a0a20, #0a0a0a)',
        padding: '20px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* 헤더 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            padding: '20px',
            paddingTop: currentEncounter ? '60px' : '20px', // 캐릭터 이름 표시 공간
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              background: 'linear-gradient(to right, #c084fc, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px',
            }}>
              🐇 Wonderland Chess 🐇
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              체스판 위의 앨리스가 되어 신비한 인물들을 만나세요
            </p>
          </div>

        {/* 메인 콘텐츠 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(300px, 2fr)',
          gap: '24px',
          alignItems: 'start',
        }}>
          {/* 왼쪽: 체스보드 */}
          <div>
            <ChessBoard
              currentPosition={currentPosition}
              encounterCount={encounterCount}
            />

            {/* 히스토리 미니 */}
            {gameHistory.length > 0 && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(30,20,40,0.6)',
                borderRadius: '12px',
                border: '1px solid rgba(147,51,234,0.2)',
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#c9a227',
                  marginBottom: '10px',
                }}>
                  📜 여정 기록
                </div>
                <div style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {gameHistory.slice(-5).map((h, i) => (
                    <div key={i} style={{ 
                      marginBottom: '8px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}>
                      <span>{h.characterEmoji} {h.character}</span>
                      <div style={{ 
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.7rem',
                        marginTop: '2px',
                      }}>
                        → {h.answer.slice(0, 30)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 대화 및 선택 */}
          <div>
            {currentEncounter && (
              <>
                {/* 인사 또는 질문 */}
                {showGreeting ? (
                  <CharacterDialogue
                    characterName={currentEncounter.characterName}
                    characterEmoji={currentEncounter.characterEmoji}
                    text={currentEncounter.greeting}
                    isGreeting={true}
                    onTypingComplete={() => {
                      setTimeout(() => setShowGreeting(false), 1000)
                    }}
                  />
                ) : currentQuestion ? (
                  <>
                    <CharacterDialogue
                      characterName={currentEncounter.characterName}
                      characterEmoji={currentEncounter.characterEmoji}
                      text={currentQuestion.text}
                      onTypingComplete={() => setTypingComplete(true)}
                    />

                    {/* 선택지 */}
                    {typingComplete && (
                      <ChoiceButtons
                        choices={currentQuestion.choices}
                        onSelect={handleChoice}
                      />
                    )}

                    {/* 질문 진행 표시 */}
                    <div style={{
                      marginTop: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                    }}>
                      {currentEncounter.questions.map((_, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: idx === currentQuestionIndex 
                              ? '#c9a227' 
                              : idx < currentQuestionIndex 
                                ? 'rgba(201,162,39,0.4)' 
                                : 'rgba(255,255,255,0.2)',
                            transition: 'all 0.3s',
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : null}

                {/* 최종 보스 표시 */}
                {currentEncounter.isFinalBattle && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(220,38,38,0.1)',
                    border: '1px solid rgba(220,38,38,0.3)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                  }}>
                    ⚔️ 최종 만남: 레드퀸 ⚔️
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}