'use client'

import BishopEncounter from './BishopEncounter'
// 추후 추가할 다른 말들
// import KnightEncounter from './KnightEncounter'
// import RookEncounter from './RookEncounter'
// import QueenEncounter from './QueenEncounter'
// import PawnEncounter from './PawnEncounter'

export default function EncounterManager({ pieceType, onComplete }) {
  if (!pieceType) return null

  switch (pieceType) {
    case 'bishop':
      return <BishopEncounter onComplete={onComplete} />
    case 'knight':
      // return <KnightEncounter onComplete={onComplete} />
      return <div>Knight Encounter (TODO)</div>
    case 'rook':
      // return <RookEncounter onComplete={onComplete} />
      return <div>Rook Encounter (TODO)</div>
    case 'queen':
      // return <QueenEncounter onComplete={onComplete} />
      return <div>Queen Encounter (TODO)</div>
    case 'pawn':
      // return <PawnEncounter onComplete={onComplete} />
      return <div>Pawn Encounter (TODO)</div>
    default:
      return null
  }
}