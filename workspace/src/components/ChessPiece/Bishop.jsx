'use client'
export default function Bishop({ position, color }) {
  const tileSize = 75
  const isWhite = color === "white"
  const c = isWhite ? "#ffffff" : "#222"
  const shadow = isWhite ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.75)"

  return (
    <div className="absolute" style={{
      width: tileSize, height: tileSize,
      transform: `translate(${position.x * tileSize}px, ${position.y * tileSize}px) translateZ(35px)`
    }}>
      <div style={{
        width: 28, height: 48,
        background: c,
        borderRadius: "50% 50% 12px 12px",
        position: "absolute",
        bottom: 18,
        left: "50%",
        transform: "translateX(-50%)",
        boxShadow: `0 6px 20px ${shadow}`
      }}/>

      <div style={{
        width: 22, height: 22,
        background: c,
        borderRadius: "50%",
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
      }}/>
    </div>
  )
}
