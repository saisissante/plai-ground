'use client'

import { useState } from 'react'
import useGameState from '@/state/gameState'

export default function TextInputModal({ onClose }) {
  const [inputText, setInputText] = useState('')
  const { submitFreeInput, isLoading } = useGameState()

  const handleSubmit = async () => {
    if (inputText.trim().length === 0) {
      alert('내용을 입력해주세요!')
      return
    }
    await submitFreeInput(inputText)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-fade">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      
      <div className="card relative z-10 max-w-2xl w-full mx-4 slide-in-bottom">
        <h2 className="text-2xl wonderland-font mb-4">당신의 대답을 작성하세요</h2>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="자유롭게 생각을 표현하세요..."
          className="input-field min-h-[150px] resize-none"
          disabled={isLoading}
          autoFocus
        />
        
        <div className="text-sm text-gray-500 mt-2 mb-4">
          {inputText.length} / 500 글자
        </div>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? '분석 중...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  )
}