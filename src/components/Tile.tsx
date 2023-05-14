import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useEffect } from 'react';
import type { TileState } from '../lib/types';
import { GAME_STATE, type GameState } from '../lib/constants/enums';

type TileProps = {
  row: number;
  col: number;
  onDoubleClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  onClick: (row: number, col: number) => void;
  changeGameState: (gameState: GameState) => void;
  state: TileState;
  gameState: GameState;
};

const Tile = ({
  state,
  row,
  col,
  gameState,
  onDoubleClick,
  onRightClick,
  onClick,
  changeGameState,
}: TileProps) => {
  useEffect(() => {
    if (state.open) {
      if (state.mine) {
        changeGameState(GAME_STATE.LOSE);
        alert('you lose');
      } else if (!state.count) {
        onClick(row, col);
      }
    }
  }, [state.open]);

  const handleClick = () => {
    if (!state.flagged) {
      onClick(row, col);
    }
  };
  const handleRightClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.open) {
      onRightClick(row, col);
    }
  };
  const handleDblClick = () => {
    if (!state.flagged && state.count) {
      onDoubleClick(row, col);
    }
  };

  return (
    <div
      className={`tile ${
        state.open ||
        (!state.flagged && state.mine && gameState === GAME_STATE.LOSE)
          ? ''
          : 'hidden'
      }`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDblClick}
    >
      {state.flagged ? (
        <FontAwesomeIcon icon="flag" className="flag" />
      ) : state.mine ? (
        <FontAwesomeIcon icon="burst" className="mine" />
      ) : state.count ? (
        state.count
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(Tile);
