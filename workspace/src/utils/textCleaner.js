/**
 * Clean and parse JSON from LLM response
 */
export function cleanAndParseJSON(text) {
  try {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim()
    
    // Parse JSON
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    console.error('Original text:', text)
    throw new Error('Invalid JSON response from LLM')
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(text) {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 500) // Limit length
}

/**
 * Check if text contains inappropriate content
 */
export function containsInappropriateContent(text) {
  const inappropriateWords = [
    'violence', 'hate', 'sex', 'kill', 'death',
    '폭력', '혐오', '성적', '살인', '죽음'
  ]
  
  const lowerText = text.toLowerCase()
  return inappropriateWords.some(word => lowerText.includes(word))
}