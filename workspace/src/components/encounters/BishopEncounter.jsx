'use client'

import { useState, useEffect } from 'react'

export default function BishopEncounter({ onComplete }) {
  const [fadeIn, setFadeIn] = useState(false)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 페이드인 효과 시작
    setFadeIn(true)
    
    // 초기 NPC 메시지 (비숍의 첫 인사)
    setMessages([
      {
        role: 'npc',
        text: '안녕하세요... 저는 대각선의 철학자, 비숍입니다. 진리는 언제나 곧은 길이 아닌 비스듬한 시선에서 발견되죠.',
      }
    ])
  }, [])

  // 사용자 메시지 전송
  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    // 사용자 메시지 추가
    const newUserMessage = { role: 'user', text: userInput }
    setMessages(prev => [...prev, newUserMessage])
    setUserInput('')
    setIsLoading(true)

    try {
      // TODO: 여기에 실제 LLM API 호출 넣기
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     message: userInput, 
      //     character: 'bishop',
      //     conversationHistory: messages 
      //   })
      // })
      // const data = await response.json()
      
      // 임시 응답 (실제로는 위의 API 호출로 대체)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'npc',
          text: '흥미로운 관점이군요. 하지만 진실은 그렇게 단순하지 않습니다... 다른 각도에서 생각해보신 적은 있나요?'
        }])
        setIsLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Failed to get response:', error)
      setIsLoading(false)
    }
  }

  // 대화 종료하고 게임으로 돌아가기
  const handleExit = () => {
    setFadeIn(false)
    setTimeout(() => {
      onComplete()
    }, 500)
  }

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        
        {/* 캐릭터 아이콘 */}
        <div className="text-9xl mb-8 animate-pulse">
          ♗
        </div>

        <h2 className="text-4xl font-bold text-white mb-8">
          대각선의 철학자, 비숍
        </h2>

        {/* 대화 메시지 영역 */}
        <div className="card max-w-3xl w-full space-y-4 max-h-96 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-lg ${
                msg.role === 'npc' 
                  ? 'bg-purple-100 text-purple-900' 
                  : 'bg-blue-100 text-blue-900 ml-auto max-w-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          ))}
          
          {/* 로딩 애니메이션 */}
          {isLoading && (
            <div className="p-4 rounded-lg bg-purple-100 text-purple-900">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="card max-w-3xl w-full">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="비숍에게 말을 걸어보세요..."
              className="flex-1 px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>

        {/* 종료 버튼 */}
        <button
          onClick={handleExit}
          className="mt-6 px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
        >
          대화 종료
        </button>
      </div>
    </div>
  )
}