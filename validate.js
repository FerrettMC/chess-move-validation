import express from "express";

const app = express();
app.use(express.json());

const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
const blackSquares = [];

for (let f = 0; f < 8; f++) {
  for (let r = 1; r <= 8; r++) {
    const isBlack = (f + r) % 2 === 1;
    if (isBlack) {
      blackSquares.push(files[f] + r);
    }
  }
}

const whiteSquares = [];

for (let f = 0; f < 8; f++) {
  for (let r = 1; r <= 8; r++) {
    const isWhite = (f + r) % 2 === 0;
    if (isWhite) {
      whiteSquares.push(files[f] + r);
    }
  }
}

const fullBoard = [];

for (let f = 0; f < 8; f++) {
  for (let r = 1; r <= 8; r++) {
    fullBoard.push(files[f] + r);
  }
}

const fullBoardArray = [];

for (let f = 8; f >= 1; f--) {
  let innerArray = [];
  for (let r = 0; r < 8; r++) {
    innerArray.push(files[r] + f);
  }
  fullBoardArray.push(innerArray);
}

app.post("/validateMove", (req, res) => {
  const { from, to, piece, color, hasMoved, board } = req.body;

  // Not on board
  if (!fullBoard.includes(to)) {
    return res.json({
      error: true,
      newPosition: from,
      message: `Cannot move to this position`,
    });
  }

  switch (piece) {
    case "pawn": {
      const toLetterIndex = files.findIndex((p) => p === to[0]);
      const fromLetterIndex = files.findIndex((p) => p === from[0]);

      // White pawn
      if (color === "white") {
        let firstMove = false;
        // First pawn move 2 squares
        if (to[1] === "4" && from[1] === "2" && from[0] === to[0]) {
          firstMove = true;
          // If opposing pawn is on the square one above
          if (
            board.some(
              (p) =>
                p.position[0] === to[0] &&
                Number(p.position[1]) === Number(to[1]) - 1,
            )
          ) {
            return res.json({
              error: true,
              newPosition: from,
              message: `Piece on ${to[0] + String(to[1] - 1)} (In the way)`,
            });
          } else {
            return res.json({ newPosition: to });
          }
        }
        // Cannot move more/less than one square
        if (Number(to[1]) - 1 !== Number(from[1]) && !firstMove) {
          return res.json({
            error: true,
            newPosition: from,
            message: `Cannot move to this position`,
          });
        }
        // Take piece (only diagonal 1)
        if (
          fromLetterIndex + 1 === toLetterIndex ||
          fromLetterIndex - 1 === toLetterIndex
        ) {
          if (board.some((p) => p.position === to)) {
            const piece = board.find((p) => p.position === to);
            let promotion = false;
            if (Number(to[1]) === 8) {
              promotion = true;
            }
            return res.json({
              promotion: promotion,
              newPosition: to,
              message: `Took ${piece.piece} on ${to}`,
            });
          }
        }
        // Cannot move to a position with a piece there already
        if (board.some((p) => p.position === to)) {
          return res.json({
            error: true,
            newPosition: from,
            message: `Piece already on ${to}`,
          });
        }
        // Basic pawn movement
        if (Number(from[1]) + 1 === Number(to[1])) {
          if (from[0] === to[0]) {
            let promotion = false;
            if (Number(to[1]) === 8) {
              promotion = true;
            }
            return res.json({ promotion: promotion, newPosition: to });
          }
        }
        // You messed up
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move to this position`,
        });
      }
      // Black pawn
      else if (color === "black") {
        let firstMove = false;
        // First pawn move 2 squares
        if (to[1] === "5" && from[1] === "7" && from[0] === to[0]) {
          firstMove = true;
          // If opposing pawn is on the square one below
          if (
            board.some(
              (p) =>
                p.position[0] === to[0] &&
                Number(p.position[1]) === Number(to[1]) + 1,
            )
          ) {
            return res.json({
              error: true,
              newPosition: from,
              message: `Piece on ${to[0] + String(Number(to[1]) + 1)} (In the way)`,
            });
          } else {
            return res.json({ newPosition: to });
          }
        }
        // Cannot move more/less than one square
        if (Number(to[1]) + 1 !== Number(from[1]) && !firstMove) {
          return res.json({
            error: true,
            newPosition: from,
            message: `Cannot move to this position`,
          });
        }
        // Take piece (only diagonal 1)
        if (
          fromLetterIndex + 1 === toLetterIndex ||
          fromLetterIndex - 1 === toLetterIndex
        ) {
          if (board.some((p) => p.position === to)) {
            const otherPiece = board.find((p) => p.position === to);
            let promotion = false;
            if (otherPiece.color !== color) {
              if (Number(to[1]) === 1) {
                promotion = true;
              }
              return res.json({
                promotion: promotion,
                newPosition: to,
                message: `Took ${otherPiece.piece} on ${to}`,
              });
            } else {
              return res.json({
                error: true,
                newPosition: from,
                message: `Cannot take own ${otherPiece.piece}`,
              });
            }
          }
        }
        // Cannot move to a position with a piece there already
        if (board.some((p) => p.position === to)) {
          return res.json({
            error: true,
            newPosition: from,
            message: `Piece already on ${to}`,
          });
        }
        // Basic pawn movement
        if (Number(from[1]) - 1 === Number(to[1])) {
          if (from[0] === to[0]) {
            let promotion = false;
            if (Number(to[1]) === 1) {
              promotion = true;
            }
            return res.json({ promotion: promotion, newPosition: to });
          }
        }
        // You messed up
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move to this position`,
        });
      }
    }
    case "rook": {
      const toLetterIndex = files.findIndex((p) => p === to[0]);
      const fromLetterIndex = files.findIndex((p) => p === from[0]);
      // Not on board

      if (to[1] !== from[1] && to[0] !== from[0]) {
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move to this position`,
        });
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
              return res.json({
                error: true,
                newPosition: from,
                message: `Piece blocking you on ${blockingPiece.position}`,
              });
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
              return res.json({
                error: true,
                newPosition: from,
                message: `Piece blocking you on ${blockingPiece.position}`,
              });
            }
          }
      }
      if (board.some((p) => p.position === to)) {
        const otherPiece = board.find((p) => p.position === to);
        if (otherPiece) {
          if (otherPiece.color !== color) {
            return res.json({
              newPosition: to,
              message: `Took ${otherPiece.piece} on ${to}`,
            });
          } else {
            return res.json({
              error: true,
              newPosition: from,
              message: `Cannot take own ${otherPiece.piece}`,
            });
          }
        }
      }
      return res.json({ newPosition: to });
    }
    case "bishop": {
      const toLetterIndex = files.findIndex((p) => p === to[0]);
      const fromLetterIndex = files.findIndex((p) => p === from[0]);
      const right = fromLetterIndex < toLetterIndex ? true : false;
      const up = Number(from[1]) < Number(to[1]) ? true : false;
      if (
        (blackSquares.includes(from) && !blackSquares.includes(to)) ||
        (whiteSquares.includes(from) && !whiteSquares.includes(to))
      ) {
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move like this`,
        });
      }
      if (
        Math.abs(fromLetterIndex - toLetterIndex) !== Math.abs(from[1] - to[1])
      ) {
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move like this`,
        });
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
          return res.json({
            error: true,
            newPosition: from,
            message: `Cannot move here, piece in the way`,
          });
        }
      }
      if (board.some((p) => p.position === to)) {
        const otherPiece = board.find((p) => p.position === to);
        if (otherPiece) {
          if (otherPiece.color !== color) {
            return res.json({
              newPosition: to,
              message: `Took ${otherPiece.piece} on ${to}`,
            });
          } else {
            return res.json({
              error: true,
              newPosition: from,
              message: `Cannot take own ${otherPiece.piece}`,
            });
          }
        }
      }
      return res.json({ newPosition: to });
    }
    case "knight": {
      const toLetterIndex = files.findIndex((p) => p === to[0]);
      const fromLetterIndex = files.findIndex((p) => p === from[0]);
      if (
        Math.abs(toLetterIndex - fromLetterIndex) +
        Math.abs(Number(to[1]) - Number(from[1])) !==
        3
      ) {
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move like this`,
        });
      }
      if (board.some((p) => p.position === to)) {
        const otherPiece = board.find((p) => p.position === to);
        if (otherPiece) {
          if (otherPiece.color !== color) {
            return res.json({
              newPosition: to,
              message: `Took ${otherPiece.piece} on ${to}`,
            });
          } else {
            return res.json({
              error: true,
              newPosition: from,
              message: `Cannot take own ${otherPiece.piece}`,
            });
          }
        }
      }
      return res.json({ newPosition: to });
    }
    case "king": {
      const toLetterIndex = files.findIndex((p) => p === to[0]);
      const fromLetterIndex = files.findIndex((p) => p === from[0]);
      if (
        Math.abs(fromLetterIndex - toLetterIndex) === 2 &&
        from[1] === to[1]
      ) {
        if (hasMoved || from[0] !== "E") {
          return res.json({
            error: true,
            newPosition: from,
            message: `Cannot move like this`,
          });
        }
        const direction =
          fromLetterIndex - toLetterIndex === 2 ? "left" : "right";
        switch (direction) {
          case "left": {
            const rook = board.find((p) => p.position === `A${from[1]}`);
            if (!rook || rook.hasMoved || rook.color !== color) {
              return res.json({
                error: true,
                newPosition: from,
                message: `No rook to castle with`,
              });
            }

            for (let i = 1; i <= 3; i++) {
              if (board.some((p) => p.position === `${files[i]}${from[1]}`)) {
                return res.json({
                  error: true,
                  newPosition: from,
                  message: `Piece in the way`,
                });
              }
            }
            return res.json({ newPosition: to });
          }
          case "right": {
            const rook = board.find((p) => p.position === `H${from[1]}`);
            if (!rook || rook.hasMoved || rook.color !== color) {
              return res.json({
                error: true,
                newPosition: from,
                message: `No rook to castle with`,
              });
            }
            for (let i = 1; i <= 2; i++) {
              if (
                board.some((p) => p.position === `${files[7 - i]}${from[1]}`)
              ) {
                return res.json({
                  error: true,
                  newPosition: from,
                  message: `Piece in the way`,
                });
              }
            }
            return res.json({ newPosition: to });
          }

          default:
            return res.json({
              error: true,
              newPosition: from,
              message: `Cannot move like this`,
            });
        }
      }
      if (
        !(
          from[0] === to[0] && Math.abs(Number(to[1]) - Number(from[1])) === 1
        ) &&
        !(
          from[1] === to[1] && Math.abs(toLetterIndex - fromLetterIndex) === 1
        ) &&
        !(
          Math.abs(toLetterIndex - fromLetterIndex) === 1 &&
          Math.abs(Number(to[1]) - Number(from[1])) === 1
        )
      ) {
        return res.json({
          error: true,
          newPosition: from,
          message: `Cannot move like this`,
        });
      }
      if (board.some((p) => p.position === to)) {
        const otherPiece = board.find((p) => p.position === to);
        if (otherPiece) {
          if (otherPiece.color !== color) {
            return res.json({
              newPosition: to,
              message: `Took ${otherPiece.piece} on ${to}`,
            });
          } else {
            return res.json({
              error: true,
              newPosition: from,
              message: `Cannot take own ${otherPiece.piece}`,
            });
          }
        }
      }
      return res.json({ newPosition: to });
    }
    default: {
      return res.json({
        error: true,
        newPosition: from,
        message: `Piece not found`,
      });
    }
  }
});

app.listen(5000, () => console.log("Validation running"));