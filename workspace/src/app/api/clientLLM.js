import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true' // 테스트 모드

export async function generateChoices(question) {
  // 테스트 모드: API 호출 없이 더미 데이터 반환
  if (TEST_MODE) {
    console.log('🧪 TEST MODE: Using dummy choices')
    await new Promise(resolve => setTimeout(resolve, 500)) // 로딩 시뮬레이션
    return {
      choices: [
        {
          id: 'test1',
          label: '논리적으로 생각해봅시다. 모든 가능성을 따져볼 필요가 있습니다.',
          type: 'logical',
        },
        {
          id: 'test2',
          label: '마음이 이끄는 대로 따라가겠습니다. 직관을 믿습니다.',
          type: 'emotional',
        },
        {
          id: 'test3',
          label: '혹시 이것도 꿈은 아닐까요? 모든 것이 의심스럽습니다.',
          type: 'weird',
        },
        {
          id: 'test4',
          label: '웃음으로 넘어가면 어떨까요? 진지함도 좋지만 말이죠.',
          type: 'humor',
        },
      ],
    }
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/llm/generate-choices`, {
      question,
    }, {
      timeout: 30000,
    })
    return response.data
  } catch (error) {
    console.error('Error generating choices:', error)
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('백엔드 서버에 연결할 수 없습니다. localhost:3001에서 서버가 실행 중인지 확인하세요.')
    }
    
    if (error.response) {
      throw new Error(`서버 에러: ${error.response.status} - ${error.response.data?.error || '알 수 없는 에러'}`)
    }
    
    throw error
  }
}

export async function analyzeFreeInput(text) {
  // 테스트 모드: API 호출 없이 더미 데이터 반환
  if (TEST_MODE) {
    console.log('🧪 TEST MODE: Using dummy analysis')
    await new Promise(resolve => setTimeout(resolve, 500)) // 로딩 시뮬레이션
    return {
      sentiment: 'positive',
      philosophy_label: 'humanism',
      top_keywords: ['생각', '감정', '선택'],
      safety: true,
      recommendations: {
        world_effects: ['세상이 조금 밝아졌다', '새로운 길이 열렸다'],
      },
    }
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/llm/analyze`, {
      player_input: text,
    }, {
      timeout: 30000,
    })
    return response.data
  } catch (error) {
    console.error('Error analyzing input:', error)
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('백엔드 서버에 연결할 수 없습니다. localhost:3001에서 서버가 실행 중인지 확인하세요.')
    }
    
    if (error.response) {
      throw new Error(`서버 에러: ${error.response.status} - ${error.response.data?.error || '알 수 없는 에러'}`)
    }
    
    throw error
  }
}