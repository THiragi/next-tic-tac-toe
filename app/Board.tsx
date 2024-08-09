import { SIZE } from '@/const/game';
import styles from './board.module.css';

export type Square = '×' | '○' | null;

type SquareProps = { value: Square; win: boolean; onSquareClick: () => void };

function Square({ value, win, onSquareClick }: SquareProps) {
  const style = {
    height: `${SIZE}px`,
    width: `${SIZE}px`,
    color: `${win ? 'blue' : 'black'}`,
    backgroundColor: `${win ? 'lightblue' : 'white'}`,
  };
  return (
    <button className={styles.square} onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

type BoardProps = {
  xIsNext: boolean;
  squares: Square[];
  onPlay: (nextSquares: Square[]) => void;
  side: number;
};

export function Board({ xIsNext, squares, onPlay, side }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares, side) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? '×' : '○';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, side);

  const status = winner
    ? 'Winner: ' + winner.square
    : 'Next player: ' + (xIsNext ? '×' : '○');

  const style = {
    height: `${SIZE * side}px`,
    width: `${SIZE * side}px`,
    display: 'grid',
    gridTemplateColumns: `repeat(${side}, 1fr)`,
    gap: '0',
  };

  return (
    <>
      <div className={styles.status}>{status}</div>
      <div style={style}>
        {squares.map((square, i) => (
          <Square
            key={`${square}-${i}`}
            value={square}
            win={winner?.line?.includes(i) ?? false}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  );
}

function calculateWinner(squares: Square[], side: number) {
  const length = [...Array(squares.length)].map((_, i) => i);
  const horizontal = length.reduce(
    (a, c) => (c % side ? a : [...a, length.slice(c, c + side)]),
    [] as number[][]
  );
  const vertical = horizontal[0].map((h) =>
    [...Array(side)].map((_, i) => i * side + h)
  );
  const leftDiagonal = horizontal.map((h, i) => h[i]);
  const rightDiagonal = horizontal.map((h, i) => h[h.length - (i + 1)]);
  const lines = [...horizontal, ...vertical, leftDiagonal, rightDiagonal];

  const match = lines.find((line) => {
    return (
      squares[line[0]] !== null &&
      line.map((l) => squares[l]).every((s) => s === squares[line[0]])
    );
  });

  if (match) {
    return {
      square: squares[match[0]],
      line: match,
    };
  }
  return null;
}
