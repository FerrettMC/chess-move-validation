import { checkPrime } from "crypto";
import { files, isPutInCheck } from "./isPutInCheck.js";
import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";
export async function isCheckMate(color, board, checkmatingPiece) {
  const theKing = board.find((p) => p.color === color && p.piece === "king");
  const possibleDirections = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
  ];
  for (let i = 0; i < 8; i++) {
    const dir = possibleDirections[i];
    const fromLetterIndex = files.findIndex((p) => p === theKing.position[0]);

    const toNum = files[fromLetterIndex + dir[0]];
    const toLetterIndex = files.findIndex((p) => p === toNum);
    if (
      toLetterIndex < 1 ||
      toLetterIndex > 8 ||
      Number(theKing.position[1]) + dir[1] < 1 ||
      Number(theKing.position[1]) + dir[1] > 8
    ) {
      continue;
    }
    const to = `${files[toLetterIndex]}${Number(theKing.position[1]) + dir[1]}`;
    console.log(to);
    const result = await king(
      theKing,
      theKing.position,
      to,
      color,
      board,
      theKing.hasMoved,
      toLetterIndex,
      fromLetterIndex,
      true,
    );
    if (!result.error) {
      const isCheck = isPutInCheck(theKing, theKing.position, to, board);
      if (!isCheck.error) {
        return { checkmate: false };
      }
    }
  }
  // Check if other pieces can block/take the opposing piece
  let sameColorPieces = board.filter((p) => p.color === theKing.color);

  for (const samePiece in sameColorPieces) {
    const fromLetterIndex = files.findIndex((p) => p === samePiece.position[0]);
    const toLetterIndex = files.findIndex(
      (p) => p === checkmatingPiece.position[0],
    );
    switch (samePiece) {
      case "pawn":
        result = await pawn(
          samePiece,
          samePiece.position,
          checkmatingPiece.position,
          samePiece.color,
          board,
          toLetterIndex,
          fromLetterIndex,
          true,
        );
        break;

      case "rook":
        result = await rook(
          samePiece,
          samePiece.position,
          checkmatingPiece.position,
          samePiece.color,
          board,
          toLetterIndex,
          fromLetterIndex,
          true,
        );
        break;

      case "bishop":
        result = await bishop(
          samePiece,
          samePiece.position,
          checkmatingPiece.position,
          samePiece.color,
          board,
          toLetterIndex,
          fromLetterIndex,
          true,
        );
        break;

      case "knight":
        result = await knight(
          samePiece,
          samePiece.position,
          checkmatingPiece.position,
          samePiece.color,
          board,
          toLetterIndex,
          fromLetterIndex,
          true,
        );
        break;

      case "king":
        result = await king(
          samePiece,
          samePiece.position,
          checkmatingPiece.position,
          samePiece.color,
          board,
          samePiece.hasMoved,
          toLetterIndex,
          fromLetterIndex,
          true,
        );
        break;

      case "queen":
        result = await queen(
          samePiece,
          samePiece.position,
          checkmatingPiece.position,
          samePiece.color,
          board,
          toLetterIndex,
          fromLetterIndex,
          true,
        );
        break;
    }
    if (!result.error) {
      return { checkmate: false };
    }
  }

  // Finally, return checkmate is true if there are no legal moves
  return { checkmate: true };
}
