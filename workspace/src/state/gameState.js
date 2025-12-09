import { create } from 'zustand'
import { generateChoices, analyzeFreeInput } from '@/app/api/clientLLM'

const useGameState = create((set, get) => ({
  // State
  question: '',
  choices: [],
  showInputModal: false,
  isLoading: false,
  worldEffects: [],
  currentCell: { x: 7, y: 7 },
  turnCount: 0,
  currentEncounter: null, // 현재 만난 말 (bishop, knight, rook, queen, pawn)
  
  // 체스말 위치 정의
  piecePositions: [
    { type: 'rook', x: 0, y: 0 },
    { type: 'knight', x: 1, y: 0 },
    { type: 'bishop', x: 2, y: 0 },
    { type: 'queen', x: 3, y: 0 },
    { type: 'pawn', x: 4, y: 1 },
    { type: 'pawn', x: 5, y: 1 },
  ],

  // 현재 위치에 말이 있는지 확인
  checkEncounter: () => {
    const { currentCell, piecePositions } = get()
    const piece = piecePositions.find(
      p => p.x === currentCell.x && p.y === currentCell.y
    )
    if (piece) {
      set({ currentEncounter: piece.type })
    }
    return piece
  },

  // 인카운터 종료
  clearEncounter: () => {
    set({ currentEncounter: null })
  },

  // LLM이 다음 위치 지정 (말이 있는 위치로만)
  moveToPosition: (x, y) => {
    const { piecePositions } = get()
    const piece = piecePositions.find(p => p.x === x && p.y === y)
    
    if (piece) {
      set({ currentCell: { x, y } })
      // 자동으로 인카운터 트리거
      setTimeout(() => {
        get().checkEncounter()
      }, 1000) // 이동 애니메이션 후
    } else {
      console.warn('해당 위치에 체스말이 없습니다:', x, y)
    }
  },

  // Actions
  loadChoices: async () => {
    set({ isLoading: true, choices: [] })
    
    try {
      const questions = [
        "당신 앞에 두 개의 문이 있습니다. 하나는 진실로, 하나는 거짓으로 이어집니다. 어느 쪽을 선택하시겠습니까?",
        "체셔 고양이가 물었습니다: '인간이란 무엇일까요? 생각하는 기계일까요, 아니면 감정을 가진 존재일까요?'",
        "앨리스는 말했습니다: '기억을 모두 잃어도 당신은 여전히 당신일까요?'",
        "하얀 토끼가 시계를 보며 말합니다: '시간이 흐른다는 것은 무엇을 의미할까요?'",
        "여왕이 외쳤습니다: '모든 규칙이 사라진다면, 우리는 무엇으로 살아야 할까요?'",
      ]
      
      const turnCount = get().turnCount
      const question = questions[turnCount % questions.length]
      
      const data = await generateChoices(question)
      
      const validChoices = Array.isArray(data.choices) ? data.choices : []
      
      set({
        question,
        choices: validChoices,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to load choices:', error)
      
      set({
        question: '오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
        choices: [
          {
            id: 'fallback1',
            label: '논리적으로 접근하겠습니다',
            type: 'logical',
          },
          {
            id: 'fallback2',
            label: '감정을 따르겠습니다',
            type: 'emotional',
          },
          {
            id: 'fallback3',
            label: '의심하며 나아가겠습니다',
            type: 'weird',
          },
        ],
        isLoading: false,
      })
    }
  },

  submitChoice: async (choice) => {
    console.log('Selected choice:', choice)
    
    // Move to next cell
    get().nextCell()
    
    // Load next question
    set({ turnCount: get().turnCount + 1 })
    
    // Check if game is over
    const { currentCell } = get()
    if (currentCell.x === 0 && currentCell.y === 0) {
      window.location.href = '/ending'
      return
    }
    
    await get().loadChoices()
  },

  submitFreeInput: async (text) => {
    set({ isLoading: true })
    
    try {
      const analysis = await analyzeFreeInput(text)
      console.log('Analysis result:', analysis)
      
      const { updateProfileFromAnalysis } = await import('@/state/playerProfile')
      updateProfileFromAnalysis.getState().updateProfileFromAnalysis(analysis)
      
      if (analysis.recommendations?.world_effects) {
        set({ worldEffects: analysis.recommendations.world_effects })
      }
      
      get().nextCell()
      
      set({ turnCount: get().turnCount + 1 })
      
      const { currentCell } = get()
      if (currentCell.x === 0 && currentCell.y === 0) {
        setTimeout(() => {
          window.location.href = '/ending'
        }, 3000)
        return
      }
      
      setTimeout(async () => {
        await get().loadChoices()
      }, 3000)
      
    } catch (error) {
      console.error('Failed to analyze input:', error)
      set({ isLoading: false })
    }
  },

  nextCell: () => {
    const { currentCell } = get()
    let newX = currentCell.x
    let newY = currentCell.y

    // Move left first, then up (아래에서 위로)
    if (newX > 0) {
      newX--
    } else if (newY > 0) {
      newX = 7
      newY--
    }

    set({ currentCell: { x: newX, y: newY } })
  },

  openInputModal: () => set({ showInputModal: true }),
  closeInputModal: () => set({ showInputModal: false }),
  clearWorldEffects: () => set({ worldEffects: [] }),
}))

export default useGameState