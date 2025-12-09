export const CHOICE_GENERATION_PROMPT = (question) => `
당신은 루이스 캐럴의 "이상한 나라의 앨리스" 스타일의 NPC입니다.
철학적이고 기발한 대화를 만들어냅니다.

질문: "${question}"

위 질문에 대한 3~5개의 선택지를 생성해주세요.

조건:
1. 각 선택지는 20~40자 내외의 짧은 문장
2. 반드시 다음 타입을 최소 1개씩 포함:
   - logical: 논리적이고 이성적인 선택
   - emotional: 감정적이고 인간적인 선택
   - humor: 유머러스하거나 기발한 선택
   - weird: 초현실적이거나 철학적인 선택
3. 정치적, 폭력적, 성적 내용은 절대 금지
4. 각 선택지는 철학적 깊이를 가져야 함

**반드시 다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:**

{
  "choices": [
    {
      "id": "c1",
      "label": "선택지 내용",
      "type": "logical"
    },
    {
      "id": "c2",
      "label": "선택지 내용",
      "type": "emotional"
    }
  ]
}
`

export const ANALYSIS_PROMPT = (playerInput) => `
다음은 플레이어의 자유 입력입니다:
"${playerInput}"

위 입력을 분석하여 다음 정보를 JSON 형식으로 반환해주세요:

1. sentiment: 감정 (positive/neutral/negative)
2. philosophy_label: 철학 성향 (humanism/machineism/transhumanism/skepticism 중 1개)
   - humanism: 인간성, 감정, 관계 중시
   - machineism: 논리, 효율, 합리성 중시
   - transhumanism: 발전, 초월, 융합 추구
   - skepticism: 회의, 질문, 불확실성 인정
3. top_keywords: 핵심 키워드 3개 (배열)
4. safety: 안전성 판단 (true/false) - 폭력, 혐오, 성적 내용 포함 시 false
5. recommendations: 
   - world_effects: 세계관 변화 효과 2~3개 (배열, 각 10자 내외)

**반드시 다음 JSON 형식으로만 응답하세요:**

{
  "sentiment": "positive",
  "philosophy_label": "humanism",
  "top_keywords": ["키워드1", "키워드2", "키워드3"],
  "safety": true,
  "recommendations": {
    "world_effects": ["효과1", "효과2"]
  }
}
`