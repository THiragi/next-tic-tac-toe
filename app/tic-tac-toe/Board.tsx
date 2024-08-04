import styles from './board.module.css';

export type Square = '×' | '○' | null;

type SquareProps = { value: Square; onSquareClick: () => void };

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className={styles.square} onClick={onSquareClick}>
      {value}
    </button>
  );
}

type BoardProps = {
  xIsNext: boolean;
  squares: Square[];
  onPlay: (nextSquares: Square[]) => void;
};

export function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? '×' : '○';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + (xIsNext ? '×' : '○');

  return (
    <>
      <div className={styles.status}>{status}</div>
      <div className={styles.board}>
        {squares.map((square, i) => (
          <Square
            key={`${square}-${i}`}
            value={square}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  );
}

function calculateWinner(squares: Square[]) {
  const side = Math.round(Math.log2(squares.length));
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
    return squares[match[0]];
  }
  return null;
}
