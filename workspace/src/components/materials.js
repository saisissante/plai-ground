// components/materials.js
import { Color } from 'three'

/**
 * 🔹 동화풍 보석 유리 재질 공통 설정
 * - 높은 투명도 + 강한 clearcoat
 * - 빛 받으면 세게 반짝
 */
function FairyGemMaterial(baseColor, props) {
  return (
    <meshPhysicalMaterial
      color={new Color(baseColor)}
      roughness={0.05}
      metalness={0.4}
      reflectivity={1.0}
      transmission={0.92}
      ior={1.55}
      thickness={1.4}
      clearcoat={1.0}
      clearcoatRoughness={0.02}
      attenuationDistance={0.8}
      attenuationColor={baseColor}
      transparent
      {...props}
    />
  )
}

/**
 * 루비 — 기본 체스말
 * 약간 핑크 기운 도는 선명한 보석색
 */
export function RubyGlassMaterial(props) {
  return FairyGemMaterial('#ba1b33', props) // 딥 루비톤
}