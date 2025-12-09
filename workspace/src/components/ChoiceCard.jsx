'use client'

export default function ChoiceCard({ choice, onClick }) {
  // choice가 undefined인 경우 방어
  if (!choice) {
    return null
  }

  const typeColors = {
    logical: 'from-blue-200 to-blue-300',
    emotional: 'from-pink-200 to-pink-300',
    humor: 'from-yellow-200 to-yellow-300',
    weird: 'from-purple-200 to-purple-300',
  }

  const typeEmojis = {
    logical: '🧠',
    emotional: '❤️',
    humor: '😄',
    weird: '🌀',
  }

  const bgColor = typeColors[choice.type] || 'from-gray-200 to-gray-300'
  const emoji = typeEmojis[choice.type] || '💭'

  return (
    <button
      onClick={() => onClick(choice)}
      className={`card card-choice bg-gradient-to-br ${bgColor} text-left w-full p-4 hover:scale-105 active:scale-98 transition-all`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{emoji}</div>
        <div className="flex-1">
          <p className="text-base font-medium">{choice.label || '선택지'}</p>
          <span className="text-xs text-gray-600 mt-1 inline-block capitalize">
            {choice.type || 'unknown'}
          </span>
        </div>
      </div>
    </button>
  )
}