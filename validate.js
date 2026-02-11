import express from "express";
import { writeFile, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pawn, knight, rook, bishop, king, queen } from "./pieces.js";

const app = express();
app.use(express.json());

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BOARD_FILE = join(__dirname, "board.json");

export const files = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const blackSquares = [];
for (let f = 0; f < 8; f++) {
  for (let r = 1; r <= 8; r++) {
    const isBlack = (f + r) % 2 === 1;
    if (isBlack) {
      blackSquares.push(files[f] + r);
    }
  }
}

export const whiteSquares = [];
for (let f = 0; f < 8; f++) {
  for (let r = 1; r <= 8; r++) {
    const isWhite = (f + r) % 2 === 0;
    if (isWhite) {
      whiteSquares.push(files[f] + r);
    }
  }
}

export const fullBoard = [];
for (let f = 0; f < 8; f++) {
  for (let r = 1; r <= 8; r++) {
    fullBoard.push(files[f] + r);
  }
}

export const fullBoardArray = [];
for (let f = 8; f >= 1; f--) {
  let innerArray = [];
  for (let r = 0; r < 8; r++) {
    innerArray.push(files[r] + f);
  }
  fullBoardArray.push(innerArray);
}

// Generate initial chess board with all pieces
const generateInitialBoard = () => {
  const board = [];

  // Define piece order for back ranks
  const backRankPieces = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  // White pieces (ranks 1 and 2)
  // Back rank (rank 1)
  files.forEach((file, index) => {
    board.push({
      position: `${file}1`,
      piece: backRankPieces[index],
      color: "white",
      hasMoved: false,
      moveNum: 0,
    });
  });

  // Pawns (rank 2)
  files.forEach((file) => {
    board.push({
      position: `${file}2`,
      piece: "pawn",
      color: "white",
      hasMoved: false,
      moveNum: 0,
    });
  });

  // Black pieces (ranks 7 and 8)
  // Pawns (rank 7)
  files.forEach((file) => {
    board.push({
      position: `${file}7`,
      piece: "pawn",
      color: "black",
      hasMoved: false,
      moveNum: 0,
    });
  });

  // Back rank (rank 8)
  files.forEach((file, index) => {
    board.push({
      position: `${file}8`,
      piece: backRankPieces[index],
      color: "black",
      hasMoved: false,
      moveNum: 0,
    });
  });

  return board;
};

app.post("/initializeBoard", async (req, res) => {
  try {
    const initialBoard = generateInitialBoard();

    // Write to board.json
    await writeFile(
      BOARD_FILE,
      JSON.stringify({ board: initialBoard }, null, 2),
      "utf8",
    );

    res.status(200).json({
      message: "Chess board initialized successfully",
      board: initialBoard,
    });
  } catch (error) {
    console.error("Error initializing board:", error);
    res.status(500).json({
      error: "Failed to initialize chess board",
      details: error.message,
    });
  }
});

app.get("/board", async (req, res) => {
  try {
    const data = await readFile(BOARD_FILE, "utf8");
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({
      error: "Board not found",
      details: error.message,
    });
  }
});

app.post("/validateMove", (req, res) => {
  const { from, to, piece, color, hasMoved, board } = req.body;
  const toLetterIndex = files.findIndex((p) => p === to[0]);
  const fromLetterIndex = files.findIndex((p) => p === from[0]);

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
      return res.json(
        pawn(from, to, color, board, toLetterIndex, fromLetterIndex),
      );
    }
    case "rook": {
      return res.json(
        rook(from, to, color, board, toLetterIndex, fromLetterIndex),
      );
    }
    case "bishop": {
      return res.json(
        bishop(from, to, color, board, toLetterIndex, fromLetterIndex),
      );
    }
    case "knight": {
      return res.json(
        knight(from, to, color, board, toLetterIndex, fromLetterIndex),
      );
    }
    case "king": {
      return res.json(
        king(from, to, color, board, toLetterIndex, hasMoved, fromLetterIndex),
      );
    }
    case "queen": {
      return res.json(
        queen(from, to, color, board, toLetterIndex, fromLetterIndex),
      );
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
