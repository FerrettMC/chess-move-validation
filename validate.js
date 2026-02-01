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

app.post("/validateMove", (req, res) => {
  const { from, to, piece, color, board } = req.body;

  switch (piece) {
    case "pawn":
      const toLetterIndex = files.findIndex((p) => p === to[0]);
      const fromLetterIndex = files.findIndex((p) => p === from[0]);
      // White pawn
      if (color === "white") {
        // Not on board
        if (!fullBoard.includes(to)) {
          return res.json({
            error: true,
            newPosition: from,
            message: `Cannot move to this position`,
          });
        }
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
        // Not on board
        if (!fullBoard.includes(to)) {
          return res.json({
            error: true,
            newPosition: from,
            message: `Cannot move to this position`,
          });
        }
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
            const piece = board.find((p) => p.position === to);
            let promotion = false;
            if (Number(to[1]) === 1) {
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
});

app.listen(5000, () => console.log("Server running"));
