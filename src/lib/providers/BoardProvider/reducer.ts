import { cloneDeep } from 'es-toolkit/object';
import type { BoardState } from '../../types';
import {
  canOpen,
  minesCalculator,
  minesGenerator,
  openEmptyTile,
} from '../../utils';

export const initialState = [
  [{ flagged: false, open: false, mine: false, count: 0 }],
];

export const BOARD_ACTION = {
  SET_BOARD: 'setBoard',
  SET_MINES: 'setMines',
  FLAG: 'flag',
  OPEN: 'open',
  DOUBLE_CLICK_OPEN: 'dblClickOpen',
  LOAD_BOARD_AND_MINES: 'loadBoardAndMines',
} as const;

type BoardActions = typeof BOARD_ACTION;

type BoardReducerActions =
  | {
      type: BoardActions['SET_BOARD'];
      payload: {
        rows: number;
        cols: number;
      };
    }
  | {
      type: BoardActions['SET_MINES'];
      payload: {
        row: number;
        col: number;
        mines: number;
      };
    }
  | {
      type: BoardActions['FLAG'];
      payload: {
        row: number;
        col: number;
      };
    }
  | {
      type: BoardActions['OPEN'];
      payload: {
        row: number;
        col: number;
      };
    }
  | {
      type: BoardActions['DOUBLE_CLICK_OPEN'];
      payload: {
        row: number;
        col: number;
      };
    }
  | {
      type: BoardActions['LOAD_BOARD_AND_MINES'];
      payload: {
        board: BoardState;
      };
    };

export const reducer = (
  state: BoardState,
  action: BoardReducerActions
): BoardState => {
  const clonedState = cloneDeep(state);
  switch (action.type) {
    case BOARD_ACTION.SET_BOARD: {
      const newBoard: BoardState = [];
      const { rows, cols } = action.payload;
      for (let r = 0; r < rows; r++) {
        const newRow = [];
        for (let c = 0; c < cols; c++) {
          newRow.push({ flagged: false, open: false, mine: false, count: 0 });
        }
        newBoard.push(newRow);
      }
      return newBoard;
    }
    case BOARD_ACTION.SET_MINES: {
      let newBoard: BoardState = [];
      const { row, col } = action.payload;
      const minesPlacement = minesGenerator(
        action.payload.mines,
        state,
        row,
        col
      );
      newBoard = clonedState.map((r, i) => {
        return r.map((tile, k) => {
          const currIndex = i * r.length + k;
          if (minesPlacement[currIndex] >= 0) {
            tile.mine = true;
          }
          return tile;
        });
      });
      newBoard = newBoard.map((r, i) =>
        r.map((tile, j) => {
          tile.count = minesCalculator(i, j, newBoard);
          return tile;
        })
      );
      newBoard[row][col].open = true;
      return newBoard;
    }
    case BOARD_ACTION.FLAG: {
      const { row, col } = action.payload;
      clonedState[row][col].flagged = !clonedState[row][col].flagged;
      return clonedState;
    }
    case BOARD_ACTION.OPEN: {
      const { row, col } = action.payload;
      if (clonedState[row][col].count || clonedState[row][col].mine) {
        clonedState[row][col].open = true;
      } else {
        openEmptyTile(row, col, clonedState);
      }
      return clonedState;
    }
    case BOARD_ACTION.DOUBLE_CLICK_OPEN: {
      const { row, col } = action.payload;
      if (canOpen(row, col, clonedState)) {
        openEmptyTile(row, col, clonedState);
      }
      return clonedState;
    }
    case BOARD_ACTION.LOAD_BOARD_AND_MINES: {
      return action.payload.board;
    }
    default:
      return state;
  }
};
