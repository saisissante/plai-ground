'use client'

import { useRouter } from 'next/navigation'
import usePlayerProfile from '@/state/playerProfile'

export default function EndingPage() {
  const router = useRouter()
  const { traits, getDominantPhilosophy } = usePlayerProfile()
  
  const dominant = getDominantPhilosophy()

  const endings = {
    humanism: {
      title: '인간성의 승리',
      description: '당신은 인간의 감정과 연결을 가장 중요하게 여깁니다. 기술보다 사람이 우선이라는 신념을 지켰습니다.',
      color: 'text-pink-600'
    },
    machineism: {
      title: '논리의 완성',
      description: '당신은 효율과 논리를 추구합니다. 감정보다 합리적 판단을 선택했습니다.',
      color: 'text-blue-600'
    },
    transhumanism: {
      title: '초월의 길',
      description: '당신은 인간과 기계의 융합을 꿈꿉니다. 한계를 넘어서는 가능성을 보았습니다.',
      color: 'text-purple-600'
    },
    skepticism: {
      title: '회의주의자',
      description: '당신은 모든 것을 의심합니다. 절대적 진리는 없다는 것을 깨달았습니다.',
      color: 'text-gray-600'
    }
  }

  const ending = endings[dominant] || endings.skepticism

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-2xl text-center fade-in">
        <h1 className={`text-5xl wonderland-font mb-6 ${ending.color}`}>
          {ending.title}
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          {ending.description}
        </p>
        
        <div className="card bg-gray-50 mb-8">
          <h3 className="text-2xl wonderland-font mb-4">최종 철학 수치</h3>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <div className="font-bold">Humanism</div>
              <div className="text-2xl text-pink-600">{traits.humanism}</div>
            </div>
            <div>
              <div className="font-bold">Machineism</div>
              <div className="text-2xl text-blue-600">{traits.machineism}</div>
            </div>
            <div>
              <div className="font-bold">Transhumanism</div>
              <div className="text-2xl text-purple-600">{traits.transhumanism}</div>
            </div>
            <div>
              <div className="font-bold">Skepticism</div>
              <div className="text-2xl text-gray-600">{traits.skepticism}</div>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => router.push('/game')}
            className="btn-primary"
          >
            다시 시작하기
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn-secondary"
          >
            메인으로
          </button>
        </div>
      </div>
    </div>
  )
}