'use client'

import ChoiceCard from './ChoiceCard'
import useGameState from '@/state/gameState'

export default function ChoiceList({ choices, onChoiceClick }) {
  const { openInputModal } = useGameState()

  // choices가 undefined이거나 배열이 아닌 경우 빈 배열 사용
  const safeChoices = Array.isArray(choices) ? choices : []

  return (
    <div className="space-y-4 fade-in">
      <h3 className="text-xl wonderland-font mb-4">당신의 선택은?</h3>
      
      {/* LLM 생성 선택지들 */}
      {safeChoices.length > 0 ? (
        <div className="space-y-3">
          {safeChoices.map((choice) => (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              onClick={onChoiceClick}
            />
          ))}
        </div>
      ) : (
        <div className="card p-4 text-center text-gray-500">
          선택지를 불러오는 중...
        </div>
      )}

      {/* 기타: 직접 입력 */}
      <button
        onClick={openInputModal}
        className="card w-full p-4 bg-gradient-to-br from-gray-100 to-gray-200 hover:scale-105 active:scale-98 transition-all text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">✍️</div>
          <div>
            <p className="font-medium">기타: 직접 입력하기</p>
            <span className="text-xs text-gray-600">나만의 대답 작성</span>
          </div>
        </div>
      </button>
    </div>
  )
}