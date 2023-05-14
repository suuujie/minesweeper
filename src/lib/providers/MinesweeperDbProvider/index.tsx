import { debounce } from 'es-toolkit';
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { BoardState } from '@/lib/types';
import { MinesweeperDb } from './indexeddb';
import { useBoard } from '../BoardProvider';
import { config } from '@/lib/config';

interface MinesweeperDbState {
  board: BoardState | null;
}

const MinesweeperDbContext = createContext<MinesweeperDbState | null>(null);

export const MinesweeperDbProvider = ({ children }: PropsWithChildren) => {
  const [dbState, setDbState] = useState<MinesweeperDbState>({
    board: null,
  });
  const { board } = useBoard();

  const dbRef = useRef<MinesweeperDb>(null);

  const updateStore = useMemo(
    () =>
      debounce((board: BoardState) => {
        if (!dbRef.current) return;

        dbRef.current.addBoardState(board);
      }, 1000),
    []
  );

  useEffect(() => {
    async function loadBoardIfExists() {
      dbRef.current = await MinesweeperDb.init();
      const savedState = await dbRef.current.getBoardState();
      if (savedState) {
        setDbState({
          board: savedState,
        });
      }
    }
    loadBoardIfExists();
  }, []);

  useEffect(() => {
    if (config.ENABLE_SAVE_AND_LOAD) {
      updateStore(board);
    }
  }, [board]);

  return (
    <MinesweeperDbContext.Provider value={dbState}>
      {children}
    </MinesweeperDbContext.Provider>
  );
};

export const useMinesweeperDb = () => {
  const dbStateContext = use(MinesweeperDbContext);
  if (!dbStateContext) {
    throw new Error(
      'useMinesweeperDb can only be used within MinesweeperDbProvider'
    );
  }
  return dbStateContext;
};
