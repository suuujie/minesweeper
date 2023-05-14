import {
  createContext,
  use,
  useReducer,
  type FC,
  type PropsWithChildren,
} from 'react';
import type { BoardSettings, BoardState } from '../../types';
import { BOARD_ACTION, initialState, reducer } from './reducer';

interface BoardContextState {
  board: BoardState;
  setBoard: (payload: BoardSettings) => void;
  setMines: (payload: { row: number; col: number; mines: number }) => void;
  open: (row: number, col: number) => void;
  flag: (row: number, col: number) => void;
  dblClickOpen: (row: number, col: number) => void;
  loadBoardAndMines: (board: BoardState) => void;
}

const BoardContext = createContext<BoardContextState | null>(null);

export const BoardProvider: FC<PropsWithChildren> = ({ children }) => {
  const [board, dispatch] = useReducer(reducer, initialState);

  const setBoard: BoardContextState['setBoard'] = (payload) =>
    dispatch({ type: BOARD_ACTION.SET_BOARD, payload });

  const setMines: BoardContextState['setMines'] = (payload) =>
    dispatch({ type: BOARD_ACTION.SET_MINES, payload });

  const flag: BoardContextState['flag'] = (row, col) =>
    dispatch({ type: BOARD_ACTION.FLAG, payload: { row, col } });

  const open: BoardContextState['open'] = (row, col) =>
    dispatch({ type: BOARD_ACTION.OPEN, payload: { row, col } });

  const dblClickOpen: BoardContextState['dblClickOpen'] = (row, col) =>
    dispatch({ type: BOARD_ACTION.DOUBLE_CLICK_OPEN, payload: { row, col } });

  const loadBoardAndMines: BoardContextState['loadBoardAndMines'] = (board) =>
    dispatch({ type: BOARD_ACTION.LOAD_BOARD_AND_MINES, payload: { board } });

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        setMines,
        open,
        flag,
        dblClickOpen,
        loadBoardAndMines,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const board = use(BoardContext);
  if (!board) {
    throw new Error('useBoard can only be used within BoardProvider');
  }
  return board;
};
