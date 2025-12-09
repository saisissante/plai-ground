import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useGameStore = create(
  persist(
    (set, get) => ({
      // 게임 상태
      gamePhase: 'intro', // 'intro' | 'playing' | 'encounter' | 'ending'
      encounterCount: 0,
      currentPosition: { x: 0, y: 0 },
      
      // 현재 만남 정보
      currentEncounter: null,
      currentQuestionIndex: 0,
      
      // 기록
      gameHistory: [],
      requiredCharactersMet: {
        bishop: false,
        knight: false,
        redQueen: false,
      },
      
      // 플레이어 정보
      drinkChoice: null,
      
      // 엔딩 데이터
      endingData: null,
      
      // 로딩 상태
      isLoading: false,
      error: null,

      // 액션들
      setDrinkChoice: (choice) => set({ drinkChoice: choice }),
      
      startGame: () => set({ 
        gamePhase: 'playing',
        encounterCount: 0,
        gameHistory: [],
        currentEncounter: null,
        requiredCharactersMet: {
          bishop: false,
          knight: false,
          redQueen: false,
        },
      }),

      // 새로운 만남 시작
      startEncounter: async () => {
        const state = get()
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameHistory: state.gameHistory,
              currentEncounter: state.encounterCount,
              encounterCount: state.encounterCount,
              drinkChoice: state.drinkChoice || localStorage.getItem('drinkChoice'),
              requiredCharactersMet: state.requiredCharactersMet,
            }),
          })

          const result = await response.json()
          
          if (result.success) {
            set({
              currentEncounter: result.data,
              currentQuestionIndex: 0,
              gamePhase: 'encounter',
              isLoading: false,
            })
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          set({ error: error.message, isLoading: false })
        }
      },

      // 선택지 선택
      selectChoice: (choice) => {
        const state = get()
        const encounter = state.currentEncounter
        const currentQuestion = encounter.questions[state.currentQuestionIndex]

        // 기록에 추가
        const historyEntry = {
          character: encounter.characterName,
          characterEmoji: encounter.characterEmoji,
          question: currentQuestion.text,
          answer: choice.text,
          trait: choice.trait,
          encounterNumber: encounter.encounterNumber,
        }

        const newHistory = [...state.gameHistory, historyEntry]
        const nextQuestionIndex = state.currentQuestionIndex + 1

        // 다음 질문이 있는지 확인
        if (nextQuestionIndex < encounter.questions.length) {
          set({
            gameHistory: newHistory,
            currentQuestionIndex: nextQuestionIndex,
          })
        } else {
          // 만남 종료
          const newEncounterCount = state.encounterCount + 1
          
          // 필수 캐릭터 만남 체크
          const newRequiredMet = { ...state.requiredCharactersMet }
          if (encounter.characterKey && encounter.characterKey !== 'optional') {
            newRequiredMet[encounter.characterKey] = true
          }

          // 7번째 만남 완료 시 엔딩으로
          if (newEncounterCount >= 7) {
            set({
              gameHistory: newHistory,
              encounterCount: newEncounterCount,
              requiredCharactersMet: newRequiredMet,
              currentEncounter: null,
              gamePhase: 'ending',
            })
          } else {
            // 다음 만남을 위해 이동
            set({
              gameHistory: newHistory,
              encounterCount: newEncounterCount,
              requiredCharactersMet: newRequiredMet,
              currentEncounter: null,
              gamePhase: 'playing',
              currentPosition: {
                x: Math.min(7, state.currentPosition.x + 1),
                y: state.currentPosition.y + (state.currentPosition.x >= 7 ? 1 : 0),
              },
            })
          }
        }
      },

      // 엔딩 생성
      generateEnding: async () => {
        const state = get()
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/ending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameHistory: state.gameHistory,
              drinkChoice: state.drinkChoice || localStorage.getItem('drinkChoice'),
            }),
          })

          const result = await response.json()
          
          if (result.success) {
            set({
              endingData: result.data,
              isLoading: false,
            })
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          set({ error: error.message, isLoading: false })
        }
      },

      // 게임 리셋
      resetGame: () => set({
        gamePhase: 'intro',
        encounterCount: 0,
        currentPosition: { x: 0, y: 0 },
        currentEncounter: null,
        currentQuestionIndex: 0,
        gameHistory: [],
        requiredCharactersMet: {
          bishop: false,
          knight: false,
          redQueen: false,
        },
        drinkChoice: null,
        endingData: null,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'wonderland-game-storage',
      partialize: (state) => ({
        gamePhase: state.gamePhase,
        encounterCount: state.encounterCount,
        currentPosition: state.currentPosition,
        gameHistory: state.gameHistory,
        requiredCharactersMet: state.requiredCharactersMet,
        drinkChoice: state.drinkChoice,
        endingData: state.endingData,
      }),
    }
  )
)

export default useGameStore