import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";
export const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
export async function isPutInCheck(fullPiece, from, to, board) {
  const opposingPieces = board.filter((p) => p.color !== fullPiece.color);
  let result;
  let putsCheck = false;
  if (fullPiece.piece === "king") {
    for (const piece of opposingPieces) {
      const fromLetterIndex = files.findIndex((p) => p === piece.position[0]);
      const toLetterIndex = files.findIndex((p) => p === to[0]);

      switch (piece.piece) {
        case "pawn":
          result = await pawn(
            piece,
            piece.position,
            to,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "rook":
          result = await rook(
            piece,
            piece.position,
            to,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "bishop":
          result = await bishop(
            piece,
            piece.position,
            to,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "knight":
          result = await knight(
            piece,
            piece.position,
            to,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "king":
          result = await king(
            piece,
            piece.position,
            to,
            piece.color,
            board,
            piece.hasMoved,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "queen":
          result = await queen(
            piece,
            piece.position,
            to,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;
      }

      if (!result.error) {
        putsCheck = true;
        console.log("NOT ERROR");
      }
    }
    if (putsCheck) {
      return { error: true, message: "this move puts the king in check." };
    }
    return { error: false, message: "Does not put king in check" };
  } else {
    const movingPiece = board.find((p) => p.position === from);
    const theKing = board.find(
      (p) => p.piece === "king" && p.color === fullPiece.color,
    );

    movingPiece.position = to;
    for (const piece of opposingPieces) {
      const fromLetterIndex = files.findIndex((p) => p === piece.position[0]);
      const toLetterIndex = files.findIndex((p) => p === theKing.position[0]);

      switch (piece.piece) {
        case "pawn":
          result = await pawn(
            piece,
            piece.position,
            theKing.position,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "rook":
          result = await rook(
            piece,
            piece.position,
            theKing.position,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "bishop":
          result = await bishop(
            piece,
            piece.position,
            theKing.position,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "knight":
          result = await knight(
            piece,
            piece.position,
            theKing.position,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "king":
          result = await king(
            piece,
            piece.position,
            theKing.position,
            piece.color,
            board,
            piece.hasMoved,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;

        case "queen":
          result = await queen(
            piece,
            piece.position,
            theKing.position,
            piece.color,
            board,
            toLetterIndex,
            fromLetterIndex,
            true,
          );
          break;
      }

      if (!result.error) {
        putsCheck = true;
        console.log("NOT ERROR");
      }
    }
    movingPiece.position = from;
    if (putsCheck) {
      return { error: true, message: "this move puts the king in check." };
    }
    return { error: false, message: "Does not put king in check" };
  }
}
