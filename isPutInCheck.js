import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";
export function isPutInCheck(piece, from, to, board) {
  const opposingPieces = board.find((p) => p.color !== piece.color);

  for (piece in opposingPieces) {
  }
}
