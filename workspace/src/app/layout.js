import './globals.css'
import '../styles/theme.css'
import '../styles/animations.css'

export const metadata = {
  title: 'LLM Storytelling Game',
  description: 'Interactive storytelling game powered by AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}