import {
  EASY_BOARD_SETTINGS,
  MED_BOARD_SETTINGS,
  HARD_BOARD_SETTINGS,
} from '../lib/constants';
import { GAME_STATE, type GameState } from '../lib/constants/enums';
import type { BoardSettings, Device, DeviceSettings } from '../lib/types';

type DifficultyButtonsProps = {
  device: Device;
  changeGameState: (gameState: GameState) => void;
  setBoardSettings: (settings: BoardSettings) => void;
};

export const DifficultyButtons = ({
  device,
  changeGameState,
  setBoardSettings,
}: DifficultyButtonsProps) => {
  const handleClick = (settings: DeviceSettings) => {
    setBoardSettings(settings[device]);
    changeGameState(GAME_STATE.IDLE);
  };

  return (
    <div className="button-group">
      <button onClick={() => handleClick(EASY_BOARD_SETTINGS)}>Easy</button>
      <button onClick={() => handleClick(MED_BOARD_SETTINGS)}>Medium</button>
      <button onClick={() => handleClick(HARD_BOARD_SETTINGS)}>Hard</button>
    </div>
  );
};
