'use client'
export default function Rook({ position, color }) {
  const tileSize = 75
  const isWhite = color === "white"
  const c = isWhite ? "#ffffff" : "#222"
  const shadow = isWhite ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0.7)"

  return (
    <div className="absolute" style={{
      width: tileSize, height: tileSize,
      transform: `translate(${position.x * tileSize}px, ${position.y * tileSize}px) translateZ(35px)`
    }}>
      {/* 상단 톱니 */}
      <div style={{
        width: 45, height: 15,
        background: c,
        display: "flex",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 65,
        left: "50%",
        transform: "translateX(-50%)"
      }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            width: 10, height: 15, background: c,
          }}/>
        ))}
      </div>

      {/* 몸통 */}
      <div style={{
        width: 45,
        height: 65,
        background: c,
        position: "absolute",
        bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        boxShadow: `0 6px 25px ${shadow}`,
      }}/>
    </div>
  )
}
