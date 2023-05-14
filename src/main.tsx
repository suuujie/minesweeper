import { library } from '@fortawesome/fontawesome-svg-core';
import { faBurst, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DifficultyButtons } from './components/DifficultyButtons';
import { MinesCounter } from './components/MinesCounter';
import Tile from './components/Tile';
import { Timer } from './components/Timer';
import { HARD_BOARD_SETTINGS } from './lib/constants';
import { DIFFICULTY, GAME_STATE, type GameState } from './lib/constants/enums';
import { BoardProvider, useBoard } from './lib/providers/BoardProvider';
import {
  MinesweeperDbProvider,
  useMinesweeperDb,
} from './lib/providers/MinesweeperDbProvider';
import type { BoardSettings } from './lib/types';
import './main.css';

// Font awesome icons
library.add(faFlag, faBurst);

const buttonWidth = 40;
const device = 'web';

const App = () => {
  const {
    board,
    setBoard,
    flag,
    open,
    setMines,
    dblClickOpen,
    loadBoardAndMines,
  } = useBoard();
  const dbState = useMinesweeperDb();
  const [gameState, setGameState] = useState<GameState>(GAME_STATE.IDLE);
  const [boardSettings, setBoardSettings] = useState<BoardSettings>(
    HARD_BOARD_SETTINGS[device]
  );
  const changeGameState = useCallback((newGameState: GameState) => {
    setGameState(newGameState);
  }, []);

  useEffect(() => {
    console.log(dbState.board);
    if (dbState.board) {
      setGameState(GAME_STATE.START);
      loadBoardAndMines(dbState.board);
    }
  }, [dbState.board]);

  useEffect(() => {
    if (gameState === GAME_STATE.IDLE) {
      setBoard(boardSettings);
    }
  }, [gameState, boardSettings]);

  useEffect(() => {
    if (
      board.flat().filter((tile) => tile.open).length +
        board.flat().filter((tile) => tile.mine).length ===
      board.flat().length
    ) {
      setGameState(GAME_STATE.WIN);
      alert('u win');
    }
  }, [board]);

  const onRightClickTile = useCallback(
    (row: number, col: number) => {
      if (gameState === GAME_STATE.START) {
        flag(row, col);
      }
    },
    [gameState]
  );

  const onClickTile = useCallback(
    (row: number, col: number) => {
      if (gameState === GAME_STATE.START) {
        open(row, col);
        return;
      }
      if (gameState === GAME_STATE.IDLE) {
        setMines({
          row,
          col,
          mines: boardSettings.mines,
        });
        setGameState(GAME_STATE.START);
        return;
      }
    },
    [gameState, boardSettings.mines]
  );

  const onDoubleClickTile = useCallback(
    (row: number, col: number) => {
      if (gameState === GAME_STATE.START) {
        dblClickOpen(row, col);
      }
    },
    [gameState]
  );

  const getContainerWidth = useMemo(() => {
    const { cols, difficulty } = boardSettings;
    switch (difficulty) {
      case DIFFICULTY.EASY:
        return buttonWidth * cols;
      case DIFFICULTY.MEDIUM:
        return buttonWidth * cols;
      case DIFFICULTY.HARD:
        return buttonWidth * cols;
    }
  }, [boardSettings]);

  return (
    <div className="App">
      <header>
        <Timer start={gameState} />
        <MinesCounter board={board} />
        <DifficultyButtons
          device={device}
          changeGameState={changeGameState}
          setBoardSettings={setBoardSettings}
        />
      </header>
      <main className="container" style={{ width: getContainerWidth }}>
        {board.map((row, r) =>
          row.map((col, c) => (
            <Tile
              key={r * board[0].length + c}
              onClick={onClickTile}
              onRightClick={onRightClickTile}
              onDoubleClick={onDoubleClickTile}
              changeGameState={changeGameState}
              state={col}
              row={r}
              col={c}
              gameState={gameState}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default () => (
  <BoardProvider>
    <MinesweeperDbProvider>
      <App />
    </MinesweeperDbProvider>
  </BoardProvider>
);
