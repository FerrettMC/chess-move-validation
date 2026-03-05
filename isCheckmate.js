import { checkPrime } from "crypto";
import { files, isPutInCheck } from "./isPutInCheck.js";
import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";
export async function isCheckMate(color, board) {
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
  return { checkmate: true };
}
