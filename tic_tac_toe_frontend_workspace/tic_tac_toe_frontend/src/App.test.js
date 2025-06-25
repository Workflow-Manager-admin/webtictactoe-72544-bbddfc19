import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders tic tac toe title", () => {
  render(<App />);
  const header = screen.getByText(/tic tac toe/i);
  expect(header).toBeInTheDocument();
});

test("shows start game button", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /start game/i });
  expect(button).toBeInTheDocument();
});

test("can play simple game and detects winner", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /start game/i }));

  // Simulate X in [0,0], O in [0,1], X in [1,1], O in [1,0], X in [2,2]
  const squares = screen.getAllByRole("button", { name: "" });
  // X
  fireEvent.click(squares[0]);
  // O
  fireEvent.click(squares[1]);
  // X
  fireEvent.click(squares[4]);
  // O
  fireEvent.click(squares[3]);
  // X
  fireEvent.click(squares[8]);
  // X wins
  expect(screen.getByText(/winner: x/i)).toBeInTheDocument();
});

test("reset score resets scoreboard", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /start game/i }));
  const squares = screen.getAllByRole("button", { name: "" });
  // Play some moves for X to win
  fireEvent.click(squares[0]);
  fireEvent.click(squares[1]);
  fireEvent.click(squares[4]);
  fireEvent.click(squares[3]);
  fireEvent.click(squares[8]);
  expect(screen.getByText(/winner: x/i)).toBeInTheDocument();
  // Now reset score
  fireEvent.click(screen.getByRole("button", { name: /reset score/i }));
  expect(screen.getByText(/x.*0.*o.*0/i)).toBeInTheDocument();
});
