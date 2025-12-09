import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { gameHistory, drinkChoice } = await request.json()

    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // 플레이어의 선택들에서 trait 추출
    const traits = gameHistory?.map(h => h.trait).filter(Boolean) || []
    const traitSummary = traits.reduce((acc, trait) => {
      acc[trait] = (acc[trait] || 0) + 1
      return acc
    }, {})

    const systemPrompt = `너는 "이상한 나라의 앨리스" 세계관의 엔딩 작성자야.
플레이어의 여정을 분석하고 개인화된 엔딩을 작성해.

플레이어 정보:
- 첫 선택(물약): ${drinkChoice === 'yes' ? '마셨다' : '안 마셨다'}
- 선택 기록: ${JSON.stringify(gameHistory, null, 2)}
- 성향 요약: ${JSON.stringify(traitSummary, null, 2)}

규칙:
1. 플레이어의 선택 패턴을 분석해서 성격 유형을 정의해
2. 엔딩은 감동적이고 개인적인 메시지를 담아야 해
3. 이상한 나라에서의 여정이 현실에서 어떤 의미를 갖는지 연결해
4. 한국어로 작성해
5. ⚠️ endingText는 반드시 공백 포함 200자 이내, 3줄 이내로 짧고 임팩트있게 작성해

응답 형식 (JSON):
{
  "playerType": "플레이어 성격 유형 (예: 용감한 몽상가, 신중한 현실주의자 등)",
  "playerTypeEmoji": "성격을 나타내는 이모지",
  "endingTitle": "엔딩 제목",
  "endingText": "엔딩 스토리 텍스트 (공백 포함 150자 이내, 3줄 이내)",
  "message": "플레이어에게 전하는 개인적 메시지 (1문장)",
  "traits": ["주요 성향1", "주요 성향2", "주요 성향3"]
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
          { role: 'user', content: '플레이어의 여정을 분석하고 엔딩을 생성해줘.' }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.9,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'OpenAI API error')
    }

    const data = await response.json()
    const endingData = JSON.parse(data.choices[0].message.content)
    
    return NextResponse.json({
      success: true,
      data: endingData
    })

  } catch (error) {
    console.error('Ending generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}