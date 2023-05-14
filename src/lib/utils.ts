import type { BoardState } from './types';

export function minesGenerator(
  mines: number,
  board: BoardState,
  r: number,
  c: number
): Record<number, number> {
  let minesPlacement: number[] = [];
  let forbiddenSqArr: number[] = [];
  if (r >= 0 && c >= 0) {
    forbiddenSqArr = getForbiddenSquares(r, c, board);
  }
  for (let i = 0; i < mines; i++) {
    let position: number = -1;
    while (
      position < 0 ||
      minesPlacement.includes(position) ||
      forbiddenSqArr.includes(position)
    ) {
      position = Math.floor(Math.random() * board.flat().length);
    }
    minesPlacement.push(position);
  }
  return minesPlacement.reduce((prev, curr, i) => {
    return { ...prev, [curr]: i };
  }, {});
}

export function minesCalculator(row: number, col: number, board: BoardState) {
  let minesCounter = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (board[r] && board[r][c]?.mine) {
        minesCounter++;
      }
    }
  }
  return minesCounter;
}

export function openEmptyTile(
  row: number,
  col: number,
  board: BoardState
): void {
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (board[r] && board[r][c] && !board[r][c]?.flagged) {
        board[r][c].open = true;
      }
    }
  }
}

export function canOpen(row: number, col: number, board: BoardState): boolean {
  let flagsCounter = board[row][col].count;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (board[r] && board[r][c] && board[r][c]?.flagged) {
        flagsCounter--;
      }
      if (flagsCounter === 0) {
        return true;
      }
    }
  }
  return false;
}

export function getForbiddenSquares(
  row: number,
  col: number,
  board: BoardState
): number[] {
  const forbidden: number[] = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (board[r] && board[r][c]) {
        forbidden.push(board[0].length * r + c);
      }
    }
  }
  return forbidden;
}
