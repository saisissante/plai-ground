import { MeshPhysicalMaterial } from 'three'

const aliceSkin = new MeshPhysicalMaterial({
  color: '#ffe2c4',
  roughness: 0.3,
  metalness: 0.1,
  transmission: 0.15,
  thickness: 0.2,
})

const aliceHair = new MeshPhysicalMaterial({
  color: '#d8b45a',
  roughness: 0.45,
  metalness: 0.2,
})

const dressMaterial = new MeshPhysicalMaterial({
  color: '#a5c8ff',
  roughness: 0.35,
  clearcoat: 0.4,
  clearcoatRoughness: 0.25,
})

export default function Alice3D({ position=[0,0,0] }) {
  return (
    <group position={position}>

      {/* Base */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.3, 0.12, 32]} />
        {dressMaterial.clone()}
      </mesh>

      {/* Body / Dress */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.55, 22, 30]} />
        {dressMaterial.clone()}
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        {aliceSkin.clone()}
      </mesh>

      {/* Hair - half dome */}
      <mesh position={[0, 1.03, -0.03]} castShadow>
        <sphereGeometry args={[0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        {aliceHair.clone()}
      </mesh>

      {/* Ribbon */}
      <mesh position={[0, 1.27, 0]}>
        <torusGeometry args={[0.2, 0.04, 12, 32]} />
        <meshPhysicalMaterial color="#ff78b0" roughness={0.35} />
      </mesh>
    </group>
  )
}
