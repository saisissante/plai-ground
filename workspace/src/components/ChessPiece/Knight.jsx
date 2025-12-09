'use client'
export default function Knight({ position, color }) {
  const tileSize = 75
  const isWhite = color === "white"
  const c = isWhite ? "#fafafa" : "#111"
  const shadow = isWhite ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.7)"

  return (
    <div className="absolute" style={{
      width: tileSize, height: tileSize,
      transform: `translate(${position.x * tileSize}px, ${position.y * tileSize}px) translateZ(35px)`
    }}>
      {/* 머리 */}
      <div style={{
        width: 32, height: 45,
        background: c,
        borderRadius: "20px 10px 5px 15px",
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%) rotateY(-10deg)",
        boxShadow: `0 6px 20px ${shadow}`
      }}/>

      {/* 목 & 몸 */}
      <div style={{
        width: 38,
        height: 55,
        background: c,
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "10px",
        boxShadow: `0 4px 18px ${shadow}`
      }}/>
    </div>
  )
}
