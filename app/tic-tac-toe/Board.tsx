import styles from './board.module.css';

export type Square = 'X' | 'O' | '';

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
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

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
  const lines = [
    [0, 1, 2], // 上横
    [0, 3, 6], // 左縦
    [0, 4, 8], // 左斜め
    [1, 4, 7], // 真ん中縦
    [2, 4, 6], // 右斜め
    [2, 5, 8], // 右縦
    [3, 4, 5], // 真ん中横
    [6, 7, 8], // 下横
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
