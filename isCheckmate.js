import { checkPrime } from "crypto";
import { files, isPutInCheck } from "./isPutInCheck.js";
import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";
import { dir } from "console";
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
  let result;
  for (let i = 0; i < 8; i++) {
    const dir = possibleDirections[i];
    const fromLetterIndex = files.findIndex((p) => p === theKing.position[0]);

    const toLetterIndex = fromLetterIndex + dir[0];

    if (
      toLetterIndex < 1 ||
      toLetterIndex > 7 ||
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
  // Check if other pieces can take the opposing piece
  let sameColorPieces = board.filter((p) => p.color === theKing.color);

  for (const samePiece of sameColorPieces) {
    const fromLetterIndex = files.findIndex((p) => p === samePiece.position[0]);
    const toLetterIndex = files.findIndex(
      (p) => p === checkmatingPiece.position[0],
    );
    switch (samePiece.piece) {
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

  // Check if other pieces can block the opposing piece
  const path = getPath(checkmatingPiece, theKing, board);
  for (const samePiece of sameColorPieces) {
    for (const pos of path) {
      const fromLetterIndex = files.findIndex(
        (p) => p === samePiece.position[0],
      );
      const toLetterIndex = files.findIndex((p) => p === pos[0]);
      switch (samePiece.piece) {
        case "pawn":
          result = await pawn(
            samePiece,
            samePiece.position,
            pos,
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
            pos,
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
            pos,
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
            pos,
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
            pos,
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
            pos,
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
  }

  // Finally, return checkmate is true if there are no legal moves
  return { checkmate: true };
}

function getPath(piece, king, board) {
  let path = [];
  const fromLetterIndex = files.findIndex((p) => p === piece.position[0]);
  const toLetterIndex = files.findIndex((p) => p === king.position[0]);
  if (Math.abs(toLetterIndex - fromLetterIndex) === 1) {
    return path;
  }
  const fromNumber = Number(piece.position[1]);
  const toNumber = Number(king.position[1]);
  switch (piece.piece) {
    case "pawn":
      return path;
    case "knight":
      return path;

    case "bishop": {
      return bishopPath(
        fromLetterIndex,
        toLetterIndex,
        fromNumber,
        toNumber,
        path,
      );
    }

    case "rook": {
      return rookPath(
        fromLetterIndex,
        toLetterIndex,
        fromNumber,
        toNumber,
        path,
      );
    }
    case "queen": {
      if (
        Math.abs(fromLetterIndex - toLetterIndex) !== 0 &&
        Math.abs(toNumber - fromNumber) !== 0
      ) {
        return bishopPath(
          fromLetterIndex,
          toLetterIndex,
          fromNumber,
          toNumber,
          path,
        );
      } else {
        return rookPath(
          fromLetterIndex,
          toLetterIndex,
          fromNumber,
          toNumber,
          path,
        );
      }
    }
  }
}

function bishopPath(
  fromLetterIndex,
  toLetterIndex,
  fromNumber,
  toNumber,
  path,
) {
  const dx = fromLetterIndex < toLetterIndex ? 1 : -1;
  const dy = fromNumber < toNumber ? 1 : -1;
  for (let i = 1; i < Math.abs(toLetterIndex - fromLetterIndex); i++) {
    const letter = files[fromLetterIndex + i * dx];
    const number = fromNumber + i * dy;
    path.push(`${letter}${number}`);
  }
  return path;
}

function rookPath(fromLetterIndex, toLetterIndex, fromNumber, toNumber, path) {
  let direction;
  let dx;
  let dy;
  if (fromLetterIndex == toLetterIndex) {
    direction = "vertical";
  } else {
    direction = "horizontal";
  }
  switch (direction) {
    case "vertical": {
      if (fromNumber < toNumber) {
        dy = 1;
      } else {
        dy = -1;
      }
      for (let i = 1; i < Math.abs(toNumber - fromNumber); i++) {
        const letter = files[fromLetterIndex];
        const number = fromNumber + i * dy;
        path.push(`${letter}${number}`);
      }
      return path;
    }
    case "horizontal": {
      if (fromLetterIndex < toLetterIndex) {
        dx = 1;
      } else {
        dx = -1;
      }
      for (let i = 1; i < Math.abs(toLetterIndex - fromLetterIndex); i++) {
        const letter = files[fromLetterIndex + i * dx];
        const number = fromNumber;
        path.push(`${letter}${number}`);
      }
      return path;
    }
  }
}
