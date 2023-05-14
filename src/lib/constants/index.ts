import type { DeviceSettings } from '../types';
import { DIFFICULTY } from './enums';

export const EASY_BOARD_SETTINGS: DeviceSettings = {
  web: {
    rows: 9,
    cols: 9,
    mines: 9,
    difficulty: DIFFICULTY.EASY,
  },
};

export const MED_BOARD_SETTINGS: DeviceSettings = {
  web: {
    rows: 16,
    cols: 16,
    mines: 40,
    difficulty: DIFFICULTY.MEDIUM,
  },
};

export const HARD_BOARD_SETTINGS: DeviceSettings = {
  web: {
    rows: 16,
    cols: 30,
    mines: 99,
    difficulty: DIFFICULTY.HARD,
  },
};
