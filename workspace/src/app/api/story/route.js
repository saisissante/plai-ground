import { NextResponse } from 'next/server'

// 필수 캐릭터와 테마
const REQUIRED_CHARACTERS = {
  bishop: {
    name: '비숍',
    theme: '양심 (인간성, 존엄성, 봉사, 폭력)',
    personality: '몇백 년을 산 듯 지긋하고 꼬장꼬장한 성직자. "허허", "그래, 그래...", "늙은이가 보기에는..." 같은 표현을 쓰며, 올바름을 강조하지만 설교하듯 말하지 않고 조용히 되묻는다. 도덕적 딜레마에 대해 질문한다.',
    emoji: '🗿'
  },
  knight: {
    name: '나이트',
    theme: '용기 (두려움, 보호, 의지)',
    personality: '친절하고 어리숙한 중년 아저씨 같은 기사. "아, 그게 말이지...", "허허, 내가 좀 서툴러서...", "자네도 알다시피..." 같은 표현을 쓴다. 용감하지만 허당끼가 있고, 따뜻하게 두려움과 용기에 대해 질문한다.',
    emoji: '🐴'
  },
  redQueen: {
    name: '레드퀸',
    theme: '욕심 (꿈, 사랑, 욕망)',
    personality: '고압적이고 선민적인 말투를 쓰는 여왕. 상대를 내려다보며 말하고, "~하거라", "~인 것이다", "감히", "보잘것없는" 같은 표현을 사용한다. 욕망과 야망에 대해 날카롭게 질문하며, 플레이어의 욕심을 시험한다.',
    emoji: '👑'
  }
}

// 추가 가능한 캐릭터들
const OPTIONAL_CHARACTERS = [
  { name: '하얀토끼', theme: '시간과 조급함', personality: '항상 바쁘고 시간에 쫓기는 토끼. "늦었어, 늦었어!", "시간이 없어!" 하며 초조해한다.', emoji: '🐰' },
  { name: '체셔고양이', theme: '정체성과 방향', personality: '수수께끼 같은 말을 하는 신비로운 고양이. 빙글빙글 말을 돌리고, 답을 줄 듯 말 듯 애태운다.', emoji: '😸' },
  { name: '모자장수', theme: '광기와 창의성', personality: '엉뚱하고 예측불가한 모자장수. 갑자기 화제를 바꾸고, 말도 안 되는 논리를 펼친다.', emoji: '🎩' },
  { name: '애벌레', theme: '변화와 성장', personality: '꿈을 꾸는 듯 몽롱한 말투의 애벌레. "음....", "그래서...", "넌... 누구지...?" 처럼 느릿느릿, 나른하게 말한다. 철학적이지만 졸린 듯한 톤으로 변화와 성장에 대해 질문한다.', emoji: '🐛' },
  { name: '트위들디와 트위들덤', theme: '선택과 결과', personality: '속을 긁고 마음을 꿰뚫어보는 듯한, 조금은 무서운 개그맨 같은 쌍둥이. 서로 말을 주거니 받거니 하며, 웃기면서도 섬뜩한 말을 한다. "그렇지 않아?" "아니, 그렇지!" 하며 플레이어를 혼란스럽게 만든다.', emoji: '👯' },
  { name: '도도새', theme: '경쟁과 승리', personality: '경쟁을 좋아하지만 모두가 이기길 원하는 새. 열정적이고 흥분하기 쉽다.', emoji: '🦤' },
]

export async function POST(request) {
  try {
    const { 
      gameHistory, 
      currentEncounter, 
      encounterCount,
      drinkChoice,
      requiredCharactersMet 
    } = await request.json()

    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // 이미 만난 캐릭터 목록 추출
    const metCharacters = gameHistory?.map(h => h.character) || []

    // 7번째 인물은 무조건 레드퀸
    const isLastEncounter = encounterCount >= 6
    const isFinalBattle = isLastEncounter

    // 다음 캐릭터 결정
    let nextCharacter
    let characterKey = 'optional'
    let allowNewCharacter = false // LLM이 새 캐릭터를 만들 수 있는지

    if (isFinalBattle) {
      nextCharacter = REQUIRED_CHARACTERS.redQueen
      characterKey = 'redQueen'
    } else if (encounterCount === 5 && !requiredCharactersMet?.redQueen) {
      // 6번째인데 레드퀸을 안 만났으면 다음(7번째)을 위해 다른 필수 캐릭터 배치
      if (!requiredCharactersMet?.bishop && !metCharacters.includes('비숍')) {
        nextCharacter = REQUIRED_CHARACTERS.bishop
        characterKey = 'bishop'
      } else if (!requiredCharactersMet?.knight && !metCharacters.includes('나이트')) {
        nextCharacter = REQUIRED_CHARACTERS.knight
        characterKey = 'knight'
      } else {
        // 아직 안 만난 선택 캐릭터 중에서 선택
        const availableOptional = OPTIONAL_CHARACTERS.filter(c => !metCharacters.includes(c.name))
        if (availableOptional.length > 0) {
          nextCharacter = availableOptional[Math.floor(Math.random() * availableOptional.length)]
        } else {
          // 모든 기존 캐릭터를 만났으면 LLM이 새 캐릭터 생성
          allowNewCharacter = true
          nextCharacter = { name: '신규 캐릭터', theme: '자유', personality: 'LLM이 생성', emoji: '✨' }
        }
      }
    } else {
      // 필수 캐릭터 중 안 만난 캐릭터가 있으면 50% 확률로 등장
      const unmetRequired = Object.entries(REQUIRED_CHARACTERS)
        .filter(([key, char]) => key !== 'redQueen' && !requiredCharactersMet?.[key] && !metCharacters.includes(char.name))
      
      if (unmetRequired.length > 0 && Math.random() > 0.5) {
        const [key, char] = unmetRequired[Math.floor(Math.random() * unmetRequired.length)]
        nextCharacter = char
        characterKey = key
      } else {
        // 10% 확률로 LLM이 신규 캐릭터 생성
        if (Math.random() < 0.1) {
          allowNewCharacter = true
          nextCharacter = { name: '신규 캐릭터', theme: '자유', personality: 'LLM이 생성', emoji: '✨' }
        } else {
          // 아직 안 만난 선택 캐릭터 중에서 선택
          const availableOptional = OPTIONAL_CHARACTERS.filter(c => !metCharacters.includes(c.name))
          if (availableOptional.length > 0) {
            nextCharacter = availableOptional[Math.floor(Math.random() * availableOptional.length)]
          } else {
            // 모든 기존 캐릭터를 만났으면 LLM이 새 캐릭터 생성
            allowNewCharacter = true
            nextCharacter = { name: '신규 캐릭터', theme: '자유', personality: 'LLM이 생성', emoji: '✨' }
          }
        }
      }
    }

    // 물약 선택에 따른 추가 지시
    let drinkChoiceInstruction = ''
    
    if (drinkChoice === 'yes') {
      drinkChoiceInstruction = `
⚠️ 특별 지시 (광기 모드): 플레이어가 물약을 마셨으므로, 질문과 선택지에 짖궂고 엉뚱한 요소를 추가해.

단, 반드시 캐릭터의 고유한 성격과 테마는 유지해야 해!
- 비숍이라면: 양심에 대한 질문이되, 비유가 황당하거나 역설적으로 표현
- 나이트라면: 용기에 대한 질문이되, 엉뚱한 상황 설정이나 기발한 비유 사용
- 레드퀸이라면: 욕망에 대한 질문이되, 위엄을 유지하면서 날카롭고 짖궂게
- 다른 캐릭터도 마찬가지로 본연의 테마와 성격은 유지!

추가할 것:
- 질문 방식이 약간 비틀어지거나 예상치 못한 방향으로 전개
- 선택지 중 하나 정도는 황당하지만 그 캐릭터다운 선택지
- 수수께끼 같은 표현이나 말장난을 섞되, 캐릭터 말투 유지
- "이상한 나라"의 광기가 느껴지되, 캐릭터의 정체성은 흐리지 않게!
`
    } else if (drinkChoice === 'slip') {
      drinkChoiceInstruction = `
⚠️ 특별 지시 (철학 모드): 플레이어가 미끄러져서 물약을 쏟았으므로, 더 깊고 철학적인 톤을 추가해.

단, 반드시 캐릭터의 고유한 성격과 테마는 유지해야 해!
- 비숍이라면: 양심에 대해 더 깊은 도덕적 딜레마, 존재론적 질문
- 나이트라면: 용기의 본질, 지키지 못한 것에 대한 회한, 진정한 용기란
- 레드퀸이라면: 욕망의 허무함, 왕관의 무게, 가진 것과 잃은 것
- 다른 캐릭터도 마찬가지로 본연의 테마를 더 깊게 파고들어!

추가할 것:
- 질문이 더 무겁고 사색적
- 상실, 후회, 시간, 선택의 무게 같은 주제 연결
- 캐릭터가 평소보다 조금 더 진지하거나 회한에 찬 말투
- 몽환적이면서 쓸쓸한 분위기, 하지만 캐릭터의 본질은 유지!
`
    }
    // 'no'인 경우는 특별 지시 없음

    // 신규 캐릭터 생성 지시
    const newCharacterInstruction = allowNewCharacter ? `
⚠️ 신규 캐릭터 생성 모드:
기존 캐릭터를 모두 만났으므로, 너가 "이상한 나라의 앨리스" 세계관에 어울리는 새로운 캐릭터를 창조해야 해!

신규 캐릭터 규칙:
1. 반드시 기존에 없는 새로운 캐릭터여야 함 (이미 만난 캐릭터: ${metCharacters.join(', ')})
2. 이상한 나라/거울 나라에 어울리는 독특한 존재 (예: 시계 수리공 두더지, 찻잔 요정, 체스판 청소부 등)
3. 고유한 성격과 말투가 있어야 함
4. 플레이어의 내면을 탐구할 수 있는 독특한 테마를 가져야 함 (예: 기억, 후회, 희망, 비밀 등)
5. 적절한 이모지를 선택해
` : ''

    // 시스템 프롬프트 구성
    const systemPrompt = `너는 "이상한 나라의 앨리스" 세계관의 인터랙티브 스토리텔러야.
플레이어는 체스판 위의 앨리스가 되어 다양한 캐릭터를 만나며 여정을 진행해.

현재 상황:
- 만난 캐릭터 수: ${encounterCount}/7
- 이미 만난 캐릭터: ${metCharacters.length > 0 ? metCharacters.join(', ') : '(없음)'}
${allowNewCharacter ? '- ⚠️ 새로운 캐릭터를 창조해야 함!' : `- 현재 만나는 캐릭터: ${nextCharacter.name} ${nextCharacter.emoji}
- 캐릭터 성격: ${nextCharacter.personality}
- 질문 테마: ${nextCharacter.theme}`}
- 플레이어의 첫 선택(물약): ${drinkChoice === 'yes' ? '마셨다 (모험적/광기)' : drinkChoice === 'slip' ? '미끄러졌다 (철학적/슬픔)' : '안 마셨다 (신중함)'}
${isFinalBattle ? `- ⚠️ 이것은 최종 보스 레드퀸과의 만남이다!
- 레드퀸의 farewell(작별 인사)는 반드시 다음 뉘앙스를 포함해야 해: "기억해. 진짜 게임은 여기가 아니라 네 세계에서 계속된단다. 네가 움직이는 한, 네가 곧 여왕이지." (꿈에서 깨어난다는 복선, 현실 세계로 돌아간다는 암시)` : ''}
${newCharacterInstruction}
${drinkChoiceInstruction}
규칙:
1. 캐릭터의 테마에 맞는 질문을 1~3개 해야 해
2. 질문은 플레이어의 성격/가치관을 파악할 수 있는 것이어야 해
3. 각 질문에는 2~3개의 선택지를 제공해
4. 선택지는 명확히 다른 성향을 나타내야 해
5. 대화는 자연스럽고 캐릭터의 개성이 드러나야 해
6. 한국어로 작성해
7. ⭐ 가장 중요: 어떤 모드(광기/철학/일반)든 캐릭터 고유의 테마와 성격은 절대 잃지 마!
   - 비숍은 항상 양심/도덕에 대해 질문
   - 나이트는 항상 용기/두려움에 대해 질문  
   - 레드퀸은 항상 욕망/야망에 대해 질문
   - 모드는 "어떻게 질문하느냐"를 바꾸는 것이지, "무엇을 질문하느냐"를 바꾸는 게 아님!

이전 대화 기록:
${gameHistory?.map(h => `[${h.character}] Q: ${h.question} → A: ${h.answer}`).join('\n') || '(첫 만남)'}

응답 형식 (JSON):
{
  "characterName": "캐릭터 이름",
  "characterEmoji": "이모지",
  "greeting": "캐릭터의 첫 인사/등장 대사 (2~3문장)",
  "questions": [
    {
      "id": 1,
      "text": "질문 내용",
      "choices": [
        { "id": "a", "text": "선택지 1", "trait": "관련 성향 키워드" },
        { "id": "b", "text": "선택지 2", "trait": "관련 성향 키워드" },
        { "id": "c", "text": "선택지 3 (선택적)", "trait": "관련 성향 키워드" }
      ]
    }
  ],
  "farewell": "모든 질문 후 떠날 때 할 말"
}`

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${nextCharacter.name}와의 만남을 생성해줘. 질문 수는 ${isFinalBattle ? '3개 (최종 보스)' : '1~2개'}로 해줘.` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'OpenAI API error')
    }

    const data = await response.json()
    const storyData = JSON.parse(data.choices[0].message.content)
    
    return NextResponse.json({
      success: true,
      data: {
        ...storyData,
        characterKey,
        isFinalBattle,
        encounterNumber: encounterCount + 1,
      }
    })

  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}