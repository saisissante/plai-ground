import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePlayerProfile = create(
  persist(
    (set, get) => ({
      // State
      traits: {
        humanism: 0,
        machineism: 0,
        transhumanism: 0,
        skepticism: 0,
      },
      keywordsCount: {},

      // Actions
      updateProfileFromAnalysis: (analysis) => {
        const { traits, keywordsCount } = get()
        
        // Update philosophy trait
        const label = analysis.philosophy_label
        if (label && traits.hasOwnProperty(label)) {
          set({
            traits: {
              ...traits,
              [label]: traits[label] + 1,
            },
          })
        }
        
        // Update keywords count
        if (analysis.top_keywords) {
          const newKeywordsCount = { ...keywordsCount }
          analysis.top_keywords.forEach((keyword) => {
            newKeywordsCount[keyword] = (newKeywordsCount[keyword] || 0) + 1
          })
          set({ keywordsCount: newKeywordsCount })
        }
      },

      getDominantPhilosophy: () => {
        const { traits } = get()
        let maxValue = 0
        let dominant = 'skepticism'
        
        Object.entries(traits).forEach(([key, value]) => {
          if (value > maxValue) {
            maxValue = value
            dominant = key
          }
        })
        
        return dominant
      },

      reset: () => {
        set({
          traits: {
            humanism: 0,
            machineism: 0,
            transhumanism: 0,
            skepticism: 0,
          },
          keywordsCount: {},
        })
      },
    }),
    {
      name: 'player-profile-storage',
    }
  )
)

export default usePlayerProfile