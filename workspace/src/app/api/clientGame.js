
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getGameState() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/game/state`)
    return response.data
  } catch (error) {
    console.error('Error getting game state:', error)
    throw error
  }
}

export async function saveGameState(state) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/game/state`, state)
    return response.data
  } catch (error) {
    console.error('Error saving game state:', error)
    throw error
  }
}