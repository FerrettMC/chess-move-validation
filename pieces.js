import { files } from "./validate.js";
export function pawn(from, to, color, board, toLetterIndex, fromLetterIndex) {
  const firstMoveSquares = color == "white" ? [4, 2] : [5, 7];
  const enPassantSquare = color == "white" ? 5 : 4;
  const direction = Number(to[1]) > Number(from[1]) ? 1 : -1;
  let firstMove = false;
  // First pawn move 2 squares
  if (
    Number(to[1]) === firstMoveSquares[0] &&
    Number(from[1]) === firstMoveSquares[1] &&
    from[0] === to[0]
  ) {
    firstMove = true;
    // If opposing pawn is on the square one above
    if (
      board.some(
        (p) =>
          p.position[0] === to[0] &&
          Number(p.position[1]) === Number(to[1]) - 1 * direction,
      )
    ) {
      return {
        error: true,
        newPosition: from,
        message: `Piece on ${to[0] + String(to[1] - 1 * direction)} (In the way)`,
      };
    } else {
      return { newPosition: to };
    }
  }
  // Cannot move more/less than one square
  if (Number(to[1]) - 1 * direction !== Number(from[1]) && !firstMove) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move to this position`,
    };
  }
  // Take piece (only diagonal 1)
  const promotionalSquare = color === "white" ? 8 : 1;
  if (
    fromLetterIndex + 1 === toLetterIndex ||
    fromLetterIndex - 1 === toLetterIndex
  ) {
    if (board.some((p) => p.position === to)) {
      const otherPiece = board.find((p) => p.position === to);
      let promotion = false;
      if (otherPiece.color !== color) {
        if (Number(to[1]) === promotionalSquare) {
          promotion = true;
        }
        return {
          promotion: promotion,
          newPosition: to,
          message: `Took ${otherPiece.piece} on ${to}`,
        };
      } else {
        return {
          error: true,
          newPosition: from,
          message: `Cannot take own ${otherPiece.piece}`,
        };
      }
    }
    if (
      board.some(
        (p) =>
          p.position[0] === files[toLetterIndex] &&
          p.moveNum === 1 &&
          Number(p.position[1]) === enPassantSquare,
      ) &&
      Number(from[1]) === enPassantSquare
    ) {
      const piece = board.find(
        (p) =>
          p.position[0] === files[toLetterIndex] &&
          Number(p.position[1]) === enPassantSquare,
      );
      if (piece) {
        return {
          newPosition: to,
          message: `En Passent ${piece.piece} on ${piece.position}`,
        };
      }
    }
  }
  // Cannot move to a position with a piece there already
  if (board.some((p) => p.position === to)) {
    return {
      error: true,
      newPosition: from,
      message: `Piece already on ${to}`,
    };
  }
  // Basic pawn movement
  if (Number(from[1]) + 1 === Number(to[1])) {
    if (from[0] === to[0]) {
      let promotion = false;
      if (Number(to[1]) === 8) {
        promotion = true;
      }
      return { promotion: promotion, newPosition: to };
    }
  }
  // You messed up
  return {
    error: true,
    newPosition: from,
    message: `Cannot move to this position [critical]`,
  };
}

export function knight(
  from,
  to,
  piece,
  color,
  hasMoved,
  board,
  toLetterIndex,
  fromLetterIndex,
) {}

export function rook(
  from,
  to,
  piece,
  color,
  hasMoved,
  board,
  toLetterIndex,
  fromLetterIndex,
) {}

export function bishop(
  from,
  to,
  piece,
  color,
  hasMoved,
  board,
  toLetterIndex,
  fromLetterIndex,
) {}

export function king(
  from,
  to,
  piece,
  color,
  hasMoved,
  board,
  toLetterIndex,
  fromLetterIndex,
) {}

export function queen(
  from,
  to,
  piece,
  color,
  hasMoved,
  board,
  toLetterIndex,
  fromLetterIndex,
) {}
