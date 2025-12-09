'use client'
import Pawn from './Pawn'
import Knight from './Knight'
import Rook from './Rook'
import Bishop from './Bishop'
import Queen from './Queen'

export default function ChessPiece({ type = "pawn", position, color = "white" }) {
  const Components = {
    pawn: Pawn,
    knight: Knight,
    rook: Rook,
    bishop: Bishop,
    queen: Queen,
  }

  const Piece = Components[type] || Pawn

  return <Piece position={position} color={color} />
}
