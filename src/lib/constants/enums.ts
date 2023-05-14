export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'med',
  HARD: 'hard',
} as const;

type Difficulties = typeof DIFFICULTY;
type DifficultyKey = keyof typeof DIFFICULTY;
export type Difficulty = Difficulties[DifficultyKey];

export const GAME_STATE = {
  IDLE: 'idle',
  START: 'start',
  WIN: 'win',
  LOSE: 'lose',
} as const;

type GameStates = typeof GAME_STATE;
type GameStateKey = keyof typeof GAME_STATE;
export type GameState = GameStates[GameStateKey];
