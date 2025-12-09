'use client'
export default function Queen({ position, color }) {
  const tileSize = 75
  const isWhite = color === "white"
  const c = isWhite ? "#fff" : "#111"
  const shadow = isWhite ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.8)"

  return (
    <div className="absolute" style={{
      width: tileSize, height: tileSize,
      transform: `translate(${position.x * tileSize}px, ${position.y * tileSize}px) translateZ(35px)`
    }}>
      {/* Crown Tips */}
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 14, height: 14,
          borderRadius: "50%",
          background: c,
          position: "absolute",
          bottom: 80,
          left: `${40 + (i-1)*16}%`,
          boxShadow: `0 2px 8px ${shadow}`
        }}/>
      ))}

      {/* Crown & Body */}
      <div style={{
        width: 42, height: 70,
        background: c,
        borderRadius: "50% 50% 10px 10px",
        position: "absolute",
        bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        boxShadow: `0 8px 28px ${shadow} inset 0 3px 8px rgba(255,255,255,.18)`,
      }}/>
    </div>
  )
}
