import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useGameStore = create(
  persist(
    (set, get) => ({
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🔰 기본 상태
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      gamePhase: 'intro', // 'intro' | 'playing' | 'encounter' | 'ending'
      encounterCount: 0,
      currentPosition: { x: 0, y: 0 }, // 체스판에서 앨리스 위치

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

      // 로딩/에러 상태
      isLoading: false,
      error: null,

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🍷 시작 선택 저장
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      setDrinkChoice: (choice) => set({ drinkChoice: choice }),

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // ▶ 게임 시작
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      startGame: () =>
        set({
          gamePhase: 'playing',
          encounterCount: 0,
          currentPosition: { x: 0, y: 0 },
          currentEncounter: null,
          currentQuestionIndex: 0,
          gameHistory: [], // 🔥 기록 초기화
          requiredCharactersMet: {
            bishop: false,
            knight: false,
            redQueen: false,
          },
          endingData: null,
          error: null,
        }),

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🧭 새로운 만남 시작
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      startEncounter: async () => {
        const state = get()
        if (state.isLoading) return

        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameHistory: state.gameHistory,
              encounterCount: state.encounterCount,
              drinkChoice:
                state.drinkChoice ??
                (typeof window !== 'undefined'
                  ? localStorage.getItem('drinkChoice')
                  : null),
              requiredCharactersMet: state.requiredCharactersMet,
            }),
          })

          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || '스토리 생성 실패')
          }

          const storyData = result.data

          // 만남 시작 → encounterCount는 "시작된 만남 수" 기준으로 +1
          set({
            currentEncounter: storyData,
            currentQuestionIndex: 0,
            gamePhase: 'encounter',
            isLoading: false,
            encounterCount: state.encounterCount + 1,
          })
        } catch (error) {
          console.error('Encounter error:', error)
          set({
            isLoading: false,
            error: error.message || '만남을 불러오는 중 문제가 발생했어요.',
          })
        }
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🎯 선택지 선택
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      selectChoice: (choice) => {
        const state = get()
        const encounter = state.currentEncounter
        if (!encounter) return

        const questions = encounter.questions || []
        const currentQuestion = questions[state.currentQuestionIndex]
        if (!currentQuestion) return

        // 기록 저장
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

        // 아직 질문이 남아 있으면 → 질문 인덱스만 증가
        if (nextQuestionIndex < questions.length) {
          set({
            gameHistory: newHistory,
            currentQuestionIndex: nextQuestionIndex,
          })
          return
        }

        // 여기 오면 이 만남의 질문이 모두 끝난 상태
        const newRequired = { ...state.requiredCharactersMet }
        if (encounter.characterKey && encounter.characterKey !== 'optional') {
          newRequired[encounter.characterKey] = true
        }

      //  if (currentEncounter && currentEncounter.isFinalBattle && currentEncounter.finalMessage) {
       // set({
       //   gamePhase: '현실로 돌아갈 떄다, 앨리스',
       //   bossMessage: currentEncounter.finalMessage,
       // })
       // return
  //  }
        // 마지막 만남인지 여부는 API에서 내려준 isFinalBattle로 판단
        const isFinalBattle = !!encounter.isFinalBattle
        
        // 체스판에서 한 칸 이동 (가로로 쭉 → 끝나면 다음 줄로)
        const { x, y } = state.currentPosition
        const nextX = x >= 7 ? 0 : x + 1
        const nextY = x >= 7 ? Math.min(7, y + 1) : y

        set({
          gameHistory: newHistory,
          currentEncounter: null,
          currentQuestionIndex: 0,
          requiredCharactersMet: newRequired,
          currentPosition: { x: nextX, y: nextY },
          gamePhase: isFinalBattle ? 'ending' : 'playing',
        })
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🏁 엔딩 생성
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      generateEnding: async () => {
        const state = get()
        if (state.isLoading || state.endingData) return

        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/ending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameHistory: state.gameHistory,
              drinkChoice:
                state.drinkChoice ??
                (typeof window !== 'undefined'
                  ? localStorage.getItem('drinkChoice')
                  : null),
            }),
          })

          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || '엔딩 생성 실패')
          }

          set({
            endingData: result.data,
            isLoading: false,
          })
        } catch (error) {
          console.error('Ending error:', error)
          set({
            isLoading: false,
            error: error.message || '엔딩을 생성하는 중 문제가 발생했어요.',
          })
        }
      },

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 🔄 게임 리셋
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      resetGame: () =>
        set({
          gamePhase: 'intro',
          encounterCount: 0,
          currentPosition: { x: 0, y: 0 },
          currentEncounter: null,
          currentQuestionIndex: 0,
          gameHistory: [], // 🔥 기록 완전 초기화
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
      // ⛔ 여기에서 gameHistory를 빼야, 기록이 localStorage에 안 남음
      partialize: (state) => ({
        gamePhase: state.gamePhase,
        encounterCount: state.encounterCount,
        currentPosition: state.currentPosition,
        requiredCharactersMet: state.requiredCharactersMet,
        drinkChoice: state.drinkChoice,
        endingData: state.endingData,
      }),
    }
  )
)

export default useGameStore
