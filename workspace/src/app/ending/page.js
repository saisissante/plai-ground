'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EndingPage() {
  const router = useRouter()
  const [endingData, setEndingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEnding = async () => {
      try {
        // 로컬 스토리지에서 게임 데이터 가져오기
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]')
        const drinkChoice = localStorage.getItem('drinkChoice') || 'no'

        if (gameHistory.length === 0) {
          // 게임 기록이 없으면 시작 페이지로
          router.push('/')
          return
        }

        const response = await fetch('/api/ending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameHistory, drinkChoice })
        })

        const result = await response.json()
        
        if (result.success) {
          setEndingData(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEnding()
  }, [router])

  const handleRestart = () => {
    localStorage.removeItem('gameHistory')
    localStorage.removeItem('drinkChoice')
    router.push('/game')
  }

  const handleHome = () => {
    localStorage.removeItem('gameHistory')
    localStorage.removeItem('drinkChoice')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="text-center text-white">
          <div className="text-4xl mb-4 animate-pulse">🔮</div>
          <p className="text-xl">당신의 여정을 분석하고 있습니다...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="text-center text-white">
          <p className="text-xl mb-4">오류가 발생했습니다: {error}</p>
          <button onClick={handleHome} className="btn-primary">
            메인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (!endingData) return null

  const { 
    userType, 
    adaptabilityScore, 
    grade, 
    gradeLabel, 
    gradeColor,
    scores,
    endingMessage,
    typeDescription,
    advice
  } = endingData

  // 축별 한글 라벨
  const axisLabels = {
    attitude: {
      name: '새로운 것에 대한 태도',
      values: { open: '열린 마음', neutral: '상황 판단', skeptical: '신중한 접근' }
    },
    literacy: {
      name: '문제 접근 방식',
      values: { high: '분석적', mid: '균형적', low: '직관적' }
    },
    preparedness: {
      name: '변화에 대한 자세',
      values: { growth: '적극 수용', cautious: '신중한 수용', avoid: '현상 유지' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* 메인 결과 카드 */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-6 text-center fade-in">
          
          {/* 사용자 유형 */}
          <div className="mb-6">
            <p className="text-purple-300 text-sm mb-2">당신은</p>
            <h1 className="text-4xl font-bold text-white mb-2">
              {userType}
            </h1>
            <p className="text-gray-300 text-sm">{typeDescription}</p>
          </div>

          {/* 적응도 점수 */}
          <div className="mb-8">
            <div className="relative w-40 h-40 mx-auto mb-4">
              {/* 원형 프로그레스 */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={gradeColor}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(adaptabilityScore / 100) * 440} 440`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              {/* 점수 표시 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{adaptabilityScore}</span>
                <span className="text-gray-400 text-sm">/ 100</span>
              </div>
            </div>
            
            {/* 등급 */}
            <div 
              className="inline-block px-4 py-2 rounded-full text-white font-bold"
              style={{ backgroundColor: gradeColor }}
            >
              {grade}등급 · {gradeLabel}
            </div>
          </div>

          {/* 엔딩 메시지 */}
          <div className="bg-black/20 rounded-2xl p-6 mb-6">
            <p className="text-white text-lg leading-relaxed whitespace-pre-line">
              {endingMessage}
            </p>
          </div>

          {/* 조언 */}
          <p className="text-purple-300 italic">💡 {advice}</p>
        </div>

        {/* 세부 성향 카드 */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-white text-lg font-bold mb-4 text-center">📊 세부 성향 분석</h3>
          
          <div className="space-y-4">
            {Object.entries(scores).map(([axis, data]) => (
              <div key={axis} className="bg-black/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">{axisLabels[axis].name}</span>
                  <span className="text-white font-bold">
                    {axisLabels[axis].values[data.dominant]}
                  </span>
                </div>
                {/* 막대 그래프 */}
                <div className="flex gap-1">
                  {Object.entries(data.detail).map(([key, value]) => (
                    <div key={key} className="flex-1">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(value / Math.max(...Object.values(data.detail), 1)) * 100}%`,
                            backgroundColor: key === data.dominant ? gradeColor : 'rgba(255,255,255,0.3)'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        {axisLabels[axis].values[key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-center fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors"
          >
            🔄 다시 시작하기
          </button>
          <button
            onClick={handleHome}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-colors"
          >
            🏠 메인으로
          </button>
        </div>

      </div>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}