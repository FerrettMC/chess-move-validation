import { files, blackSquares, whiteSquares, returnMove } from "./validate.js";

async function moveDone(board, fullPiece, to, from, promotion = false) {
  const thePiece = board.find(
    (p) =>
      p.position === fullPiece.position &&
      p.piece === fullPiece.piece &&
      p.color === fullPiece.color,
  );

  if (!thePiece)
    return { error: true, newPosition: from, message: "Piece not found" }; // piece not found

  thePiece.position = to;
  thePiece.hasMoved = true;
  thePiece.moveNum++;
  if (promotion) thePiece.piece = "queen";
  await returnMove(board);
  return { newPosition: to, message: "Move made" };
}

export async function pawn(
  fullPiece,
  from,
  to,
  color,
  board,
  toLetterIndex,
  fromLetterIndex,
) {
  const firstMoveSquares = color == "white" ? [4, 2] : [5, 7];
  const enPassantSquare = color == "white" ? 5 : 4;
  const direction = Number(to[1]) > Number(from[1]) ? 1 : -1;
  let firstMove = false;

  if (
    Number(to[1]) === firstMoveSquares[0] &&
    Number(from[1]) === firstMoveSquares[1] &&
    from[0] === to[0]
  ) {
    firstMove = true;

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
      return await moveDone(board, fullPiece, to, from);
    }
  }

  if (Number(to[1]) - 1 * direction !== Number(from[1]) && !firstMove) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move to this position`,
    };
  }

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
        return await moveDone(board, fullPiece, to, from, promotion);
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
        return await moveDone(board, fullPiece, to, from);
      }
    }
  }

  if (board.some((p) => p.position === to)) {
    return {
      error: true,
      newPosition: from,
      message: `Piece already on ${to}`,
    };
  }

  if (Number(from[1]) + 1 === Number(to[1])) {
    if (from[0] === to[0]) {
      let promotion = false;
      if (Number(to[1]) === 8) {
        promotion = true;
      }
      return await moveDone(board, fullPiece, to, from, promotion);
    }
  }

  return {
    error: true,
    newPosition: from,
    message: `Cannot move to this position [critical]`,
  };
}

export async function rook(
  fullPiece,
  from,
  to,
  color,
  board,
  toLetterIndex,
  fromLetterIndex,
) {
  // Not on board

  if (to[1] !== from[1] && to[0] !== from[0]) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move to this position`,
    };
  }
  const direction = to[1] === from[1] ? "horizontal" : "vertical";
  switch (direction) {
    case "horizontal":
      for (let i = 1; i < Math.abs(toLetterIndex - fromLetterIndex); i++) {
        let blockingPiece = false;
        if (toLetterIndex > fromLetterIndex) {
          blockingPiece = board.find(
            (p) => p.position === `${files[fromLetterIndex + i]}${to[1]}`,
          );
        } else {
          blockingPiece = board.find(
            (p) => p.position === `${files[fromLetterIndex - i]}${to[1]}`,
          );
        }
        if (blockingPiece) {
          return {
            error: true,
            newPosition: from,
            message: `Piece blocking you on ${blockingPiece.position}`,
          };
        }
      }
    case "vertical":
      for (let i = 1; i < Math.abs(Number(to[1]) - Number(from[1])); i++) {
        let blockingPiece = false;
        if (Number(to[1]) > Number(from[1])) {
          blockingPiece = board.find(
            (p) => p.position === `${from[0]}${Number(from[1]) + i}`,
          );
        } else {
          blockingPiece = board.find(
            (p) => p.position === `${from[0]}${Number(from[1]) - i}`,
          );
        }
        if (blockingPiece) {
          return {
            error: true,
            newPosition: from,
            message: `Piece blocking you on ${blockingPiece.position}`,
          };
        }
      }
  }
  if (board.some((p) => p.position === to)) {
    const otherPiece = board.find((p) => p.position === to);
    if (otherPiece) {
      if (otherPiece.color !== color) {
        return await moveDone(board, fullPiece, to, from);
      } else {
        return {
          error: true,
          newPosition: from,
          message: `Cannot take own ${otherPiece.piece}`,
        };
      }
    }
  }
  return await moveDone(board, fullPiece, to, from);
}

export async function bishop(
  fullPiece,
  from,
  to,
  color,
  board,
  toLetterIndex,
  fromLetterIndex,
) {
  const right = fromLetterIndex < toLetterIndex ? true : false;
  const up = Number(from[1]) < Number(to[1]) ? true : false;
  if (
    (blackSquares.includes(from) && !blackSquares.includes(to)) ||
    (whiteSquares.includes(from) && !whiteSquares.includes(to))
  ) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move like this`,
    };
  }
  if (Math.abs(fromLetterIndex - toLetterIndex) !== Math.abs(from[1] - to[1])) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move like this`,
    };
  }
  const dx = right ? 1 : -1;
  const dy = up ? 1 : -1;

  for (let i = 1; i < Math.abs(fromLetterIndex - toLetterIndex); i++) {
    const numHorizontal = fromLetterIndex + dx * i;
    const numVertical = Number(from[1]) + dy * i;

    if (
      board.some(
        (p) =>
          p.position[0] === files[numHorizontal] &&
          Number(p.position[1]) === numVertical,
      )
    ) {
      return {
        error: true,
        newPosition: from,
        message: `Cannot move here, piece in the way`,
      };
    }
  }
  if (board.some((p) => p.position === to)) {
    const otherPiece = board.find((p) => p.position === to);
    if (otherPiece) {
      if (otherPiece.color !== color) {
        return await moveDone(board, fullPiece, to, from);
      } else {
        return {
          error: true,
          newPosition: from,
          message: `Cannot take own ${otherPiece.piece}`,
        };
      }
    }
  }
  return await moveDone(board, fullPiece, to, from);
}

export async function knight(
  fullPiece,
  from,
  to,
  color,
  board,
  toLetterIndex,
  fromLetterIndex,
) {
  if (
    Math.abs(toLetterIndex - fromLetterIndex) +
      Math.abs(Number(to[1]) - Number(from[1])) !==
    3
  ) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move like this`,
    };
  }
  if (board.some((p) => p.position === to)) {
    const otherPiece = board.find((p) => p.position === to);
    if (otherPiece) {
      if (otherPiece.color !== color) {
        return await moveDone(board, fullPiece, to, from);
      } else {
        return {
          error: true,
          newPosition: from,
          message: `Cannot take own ${otherPiece.piece}`,
        };
      }
    }
  }
  return await moveDone(board, fullPiece, to, from);
}

export async function queen(
  fullPiece,
  from,
  to,
  color,
  board,
  toLetterIndex,
  fromLetterIndex,
) {
  const right = fromLetterIndex < toLetterIndex ? true : false;
  const up = Number(from[1]) < Number(to[1]) ? true : false;
  if (toLetterIndex !== fromLetterIndex && to[1] !== from[1]) {
    return await bishop(from, to, color, board, toLetterIndex, fromLetterIndex);
  } else {
    return await rook(from, to, color, board, toLetterIndex, fromLetterIndex);
  }
}

export async function king(
  fullPiece,
  from,
  to,
  color,
  board,
  hasMoved,
  toLetterIndex,
  fromLetterIndex,
) {
  if (Math.abs(fromLetterIndex - toLetterIndex) === 2 && from[1] === to[1]) {
    if (hasMoved || from[0] !== "E") {
      return {
        error: true,
        newPosition: from,
        message: `Cannot move like this`,
      };
    }
    const direction = fromLetterIndex - toLetterIndex === 2 ? "left" : "right";
    switch (direction) {
      case "left": {
        const rook = board.find((p) => p.position === `A${from[1]}`);
        if (!rook || rook.hasMoved || rook.color !== color) {
          return {
            error: true,
            newPosition: from,
            message: `No rook to castle with`,
          };
        }

        for (let i = 1; i <= 3; i++) {
          if (board.some((p) => p.position === `${files[i]}${from[1]}`)) {
            return {
              error: true,
              newPosition: from,
              message: `Piece in the way`,
            };
          }
        }
        return await moveDone(board, fullPiece, to, from);
      }
      case "right": {
        const rook = board.find((p) => p.position === `H${from[1]}`);
        if (!rook || rook.hasMoved || rook.color !== color) {
          return {
            error: true,
            newPosition: from,
            message: `No rook to castle with`,
          };
        }
        for (let i = 1; i <= 2; i++) {
          if (board.some((p) => p.position === `${files[7 - i]}${from[1]}`)) {
            return {
              error: true,
              newPosition: from,
              message: `Piece in the way`,
            };
          }
        }
        return await moveDone(board, fullPiece, to, from);
      }

      default:
        return {
          error: true,
          newPosition: from,
          message: `Cannot move like this`,
        };
    }
  }
  if (
    !(from[0] === to[0] && Math.abs(Number(to[1]) - Number(from[1])) === 1) &&
    !(from[1] === to[1] && Math.abs(toLetterIndex - fromLetterIndex) === 1)
  ) {
    return {
      error: true,
      newPosition: from,
      message: `Cannot move like this`,
    };
  }
  if (board.some((p) => p.position === to)) {
    const otherPiece = board.find((p) => p.position === to);
    if (otherPiece) {
      if (otherPiece.color !== color) {
        return await moveDone(board, fullPiece, to, from);
      } else {
        return {
          error: true,
          newPosition: from,
          message: `Cannot take own ${otherPiece.piece}`,
        };
      }
    }
  }
  return await moveDone(board, fullPiece, to, from);
}
