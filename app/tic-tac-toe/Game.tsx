'use client';

import { useState } from 'react';
import { Board, type Square } from './Board';
import styles from './game.module.css';

export function Game() {
  const [side, setSide] = useState(4);
  const [history, setHistory] = useState<Square[][]>([
    Array(side ** 2).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Square[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function handleSide(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const side = Number(value);
    setSide(side);
    setHistory([Array(side ** 2).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className={styles.outer}>
      <div className={styles.slider}>
        <label htmlFor="side">
          <span>{`SIDE: ${side}`}</span>
          <input
            id="side"
            name="side"
            type="range"
            min={3}
            max={5}
            onChange={handleSide}
          />
        </label>
      </div>
      <div className={styles.game}>
        <div className={styles.gameBoard}>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            side={side}
          />
        </div>
        <div className={styles.gameInfo}>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
