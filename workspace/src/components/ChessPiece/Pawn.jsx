'use client'
export default function Pawn({ position, color }) {
  const tileSize = 75
  const isWhite = color === "white"
  const c = isWhite ? "#fdfdfd" : "#222"
  const shadow = isWhite ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.75)"

  return (
    <div className="absolute" style={{
      width: tileSize, height: tileSize,
      transform: `translate(${position.x * tileSize}px, ${position.y * tileSize}px) translateZ(35px)`
    }}>
      {/* Head */}
      <div style={{
        width: 24, height: 24,
        borderRadius: "50%",
        background: c,
        position: "absolute",
        bottom: 50, left: "50%",
        transform: "translateX(-50%)",
        boxShadow: `0 4px 12px ${shadow}`,
      }} />

      {/* Body */}
      <div style={{
        width: 38, height: 58,
        borderRadius: "18px 18px 8px 8px",
        background: c,
        position: "absolute",
        bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        boxShadow: `0 8px 25px ${shadow} inset 0 2px 8px rgba(255,255,255,.2)`,
      }} />
    </div>
  )
}
