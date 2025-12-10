import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { gameHistory, drinkChoice } = await request.json()

    // 기본 검사
    if (!gameHistory || gameHistory.length === 0) {
      return NextResponse.json(
        { success: false, error: "엔딩 생성 실패: 히스토리가 없습니다." },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    // ----------------------------------------------------
    // 1) 기존 trait 계산(유지)
    // ----------------------------------------------------
    const traitScores = { open: 0, cautious: 0, avoid: 0 }

    gameHistory.forEach(entry => {
      if (!entry.trait) return
      const parts = entry.trait.split('|')
      parts.forEach(t => {
        if (t.includes("open")) traitScores.open++
        if (t.includes("cautious")) traitScores.cautious++
        if (t.includes("avoid")) traitScores.avoid++
      })
    })

    // traitSummary 형태로 변환하여 AI에 전달
    const traitSummary = {
      open: traitScores.open,
      cautious: traitScores.cautious,
      avoid: traitScores.avoid
    }

    // ----------------------------------------------------
    // 2) 엔딩 생성용 LLM 프롬프트
    // ----------------------------------------------------
    const systemPrompt = `
너는 "이상한 나라의 앨리스" 세계관의 엔딩 작성자야.
플레이어의 여정을 분석하고 개인화된 엔딩을 작성해.

🎮 플레이어 정보
- 첫 선택(물약): ${drinkChoice === "yes" ? "마셨다" : "안 마셨다"}
- 선택 기록: ${JSON.stringify(gameHistory, null, 2)}
- 성향 요약: ${JSON.stringify(traitSummary, null, 2)}

🎯 규칙
1. 플레이어의 선택 패턴을 분석해 성격 유형을 정의한다.
2. 엔딩 제목은 상징적이어야 한다.
3. 엔딩 텍스트는 현실과 연결되는 짧고 여운 있는 3줄 이하 문장으로, 공백 포함 200자 이내.
4. message는 플레이어에게 주는 1문장 조언.
5. traits 배열에는 플레이어의 성향을 3줄로 요약한다.

응답 형식(JSON):
{
  "playerType": "플레이어 성격 유형",
  "playerTypeEmoji": "이모지",
  "endingTitle": "엔딩 제목",
  "endingText": "3줄 이내, 공백 포함 200자 이하",
  "message": "플레이어에게 남기는 1문장",
  "traits": ["성향1", "성향2", "성향3"]
}
`

    // ----------------------------------------------------
    // 3) LLM 호출
    // ----------------------------------------------------
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "플레이어의 여정을 분석하고 엔딩을 생성해줘." }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9
      })
    })

    // LLM 실패했을 때 fallback 엔딩 제공
    if (!response.ok) {
      console.error("LLM 엔딩 생성 실패. Fallback 엔딩으로 대체합니다.")
      return NextResponse.json({
        success: true,
        data: {
          endingTitle: "낯선 길의 끝에서",
          playerType: "방랑자",
          playerTypeEmoji: "✨",
          traits: [
            `개방성: ${traitScores.open}`,
            `신중함: ${traitScores.cautious}`,
            `회피성: ${traitScores.avoid}`
          ],
          endingText: "이상한 나라에서의 여정은 끝났지만,\n당신의 선택은 현실에서 새로운 의미를 찾기 시작합니다.",
          message: "당신이 걸어온 길은 언제나 스스로가 선택한 길입니다."
        }
      })
    }

    const data = await response.json()
    const endingData = JSON.parse(data.choices[0].message.content)

    // ----------------------------------------------------
    // 4) 최종 응답(EndingScreen.jsx 요구 형태 그대로)
    // ----------------------------------------------------
    return NextResponse.json({
      success: true,
      data: endingData
    })

  } catch (error) {
    console.error("Ending generation error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
