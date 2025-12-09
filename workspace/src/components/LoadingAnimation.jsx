'use client'

export default function LoadingAnimation() {
  return (
    <div className="card text-center py-8 fade-in">
      <div className="inline-block">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <p className="text-gray-600 mt-4">AI가 생각하는 중...</p>
    </div>
  )
}