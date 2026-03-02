import { error } from "console";
import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";
export async function putsOtherInCheck(fullPiece, from, board) {
  /* the "from" here is really where the piece is moving to, but since this function checks if the piece is pointed at the
  king we will call it from, since it is the theoretical "from" point if the piece is moving to the king's position. */
  const otherKing = board.find(
    (p) => p.piece == "king" && p.color != fullPiece.color,
  );
  if (!otherKing) {
    return { error: true, message: "No other king found!" };
  }
  const fromLetterIndex = files.findIndex((p) => p === from[0]);
  const toLetterIndex = files.findIndex((p) => p === otherKing.position[0]);
  switch (fullPiece.piece) {
    case "pawn":
      result = await pawn(
        fullPiece.piece,
        from,
        otherKing.position,
        piece.color,
        board,
        toLetterIndex,
        fromLetterIndex,
        true,
      );
      break;

    case "rook":
      result = await rook(
        fullPiece.piece,
        from,
        otherKing.position,
        piece.color,
        board,
        toLetterIndex,
        fromLetterIndex,
        true,
      );
      break;

    case "bishop":
      result = await bishop(
        fullPiece.piece,
        from,
        otherKing.position,
        piece.color,
        board,
        toLetterIndex,
        fromLetterIndex,
        true,
      );
      break;

    case "knight":
      result = await knight(
        fullPiece.piece,
        from,
        otherKing.position,
        piece.color,
        board,
        toLetterIndex,
        fromLetterIndex,
        true,
      );
      break;

    case "king":
      return { error: true, message: "Error [critical]" };

    case "queen":
      result = await queen(
        fullPiece.piece,
        from,
        otherKing.position,
        piece.color,
        board,
        toLetterIndex,
        fromLetterIndex,
        true,
      );
      break;
  }
  if (result.error) {
    return { error: true, message: "Error" };
  }
  if (result.newPosition === otherKing.position) {
    return { error: false, putsInCheck: true };
  } else {
    return { error: false, putsInCheck: false };
  }
}
