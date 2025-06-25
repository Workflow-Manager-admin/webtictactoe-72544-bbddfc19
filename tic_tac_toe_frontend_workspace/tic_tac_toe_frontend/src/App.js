import React, { useState, useEffect } from "react";
import "./App.css";

// Minimalistic, light, responsive Tic Tac Toe frontend
// Board: 3x3, Scoreboard, Turn Indicator, Start/Reset, Win/Draw detection

const EMPTY_BOARD = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// Utility for deep cloning board
function cloneBoard(board) {
  return board.map((row) => row.slice());
}

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(cloneBoard(EMPTY_BOARD));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  // Responsive: adjust for mobile
  useEffect(() => {
    function handleResize() {
      // Example: force re-render for responsiveness (if needed in real complex UIs)
      // Not doing much here since we use CSS, but reserved for future needs.
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Win/draw detection
  useEffect(() => {
    const res = calculateWinner(board);
    if (res) {
      setWinner(res);
      setGameActive(false);
      setScore((prev) => ({
        ...prev,
        [res]: (prev[res] || 0) + 1,
      }));
    } else if (gameActive && isBoardFull(board)) {
      setIsDraw(true);
      setGameActive(false);
    }
  }, [board, gameActive]);

  // PUBLIC_INTERFACE
  function startGame() {
    setBoard(cloneBoard(EMPTY_BOARD));
    setWinner(null);
    setIsDraw(false);
    setCurrentPlayer("X");
    setGameActive(true);
  }

  // PUBLIC_INTERFACE
  function resetScoreboard() {
    setScore({ X: 0, O: 0 });
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(rowIdx, colIdx) {
    if (!gameActive || board[rowIdx][colIdx] || winner) return;
    const newBoard = cloneBoard(board);
    newBoard[rowIdx][colIdx] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
  }

  // Display helpers
  function getStatusText() {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "It's a draw!";
    if (!gameActive) return "Press Start to play";
    return `Turn: ${currentPlayer}`;
  }

  // Root render
  return (
    <div className="ttt-app-bg">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <Scoreboard score={score} />
        <div className="ttt-controls">
          {!gameActive && (
            <button className="ttt-btn accent" onClick={startGame}>
              {winner || isDraw ? "Restart Game" : "Start Game"}
            </button>
          )}
          <button className="ttt-btn reset" onClick={resetScoreboard}>
            Reset Score
          </button>
        </div>
        <div className="ttt-status">{getStatusText()}</div>
        <GameBoard
          board={board}
          onSquareClick={handleSquareClick}
          disabled={!gameActive || !!winner || isDraw}
        />
        <footer className="ttt-footer">
          <span>
            <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
              Built with React
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function GameBoard({ board, onSquareClick, disabled }) {
  return (
    <div className={`ttt-board`}>
      {board.map((row, r) =>
        row.map((val, c) => (
          <Square
            key={`${r}-${c}`}
            value={val}
            onClick={() => onSquareClick(r, c)}
            disabled={disabled || val !== ""}
          />
        ))
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  return (
    <button
      className={`ttt-square${value ? " filled" : ""}`}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onClick={onClick}
      aria-label={value ? value : "empty"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Scoreboard({ score }) {
  return (
    <div className="ttt-scoreboard" aria-label="Scoreboard">
      <span className="score-x">
        X&nbsp;<strong>{score.X}</strong>
      </span>
      <span className="score-divider">|</span>
      <span className="score-o">
        O&nbsp;<strong>{score.O}</strong>
      </span>
    </div>
  );
}

// --- Game logic utilities ---

// PUBLIC_INTERFACE
function calculateWinner(board) {
  // Rows, columns, diagonals
  for (let i = 0; i < 3; i++) {
    // Rows
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    )
      return board[i][0];
    // Columns
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    )
      return board[0][i];
  }
  // Diagonals
  if (
    board[1][1] &&
    ((board[0][0] === board[1][1] && board[2][2] === board[1][1]) ||
      (board[0][2] === board[1][1] && board[2][0] === board[1][1]))
  )
    return board[1][1];
  return null;
}

// PUBLIC_INTERFACE
function isBoardFull(board) {
  return board.every((row) => row.every((val) => val));
}

export default App;
