import type { Difficulty } from '../constants/enums';

export type TileState = {
  flagged: boolean;
  open: boolean;
  mine: boolean;
  count: number;
};

export type BoardState = TileState[][];

export type DeviceSettings = {
  web: BoardSettings;
};

export type BoardSettings = {
  rows: number;
  cols: number;
  mines: number;
  difficulty: Difficulty;
};

export type Device = keyof DeviceSettings;
