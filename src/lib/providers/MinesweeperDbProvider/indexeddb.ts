import type { BoardState } from '../../types';

const DB_NAME = 'saved-state';
const BOARD_STORE_NAME = 'boardStore';

export const getIndexedDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (e) => {
      console.error('Unable to open database :(', e);
      reject(e);
    };
    request.onsuccess = function () {
      resolve(this.result);
    };
    request.onupgradeneeded = function () {
      this.result.createObjectStore(BOARD_STORE_NAME, {
        autoIncrement: true,
      });
    };
  });

export const getLatestItemFromDbStore = <T = any>(store: IDBObjectStore) =>
  new Promise<T>((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = function () {
      if (this.result) {
        resolve(this.result.at(-1));
      } else {
        reject();
      }
    };
    request.onerror = function (e) {
      reject(e);
    };
  });

export class MinesweeperDb {
  #db: IDBDatabase;
  constructor(db: IDBDatabase) {
    this.#db = db;
  }

  static async init() {
    const db = await getIndexedDb();
    return new MinesweeperDb(db);
  }

  private getStore(storeName: string, mode: IDBTransactionMode) {
    return this.#db.transaction(storeName, mode).objectStore(storeName);
  }

  private getStoreState<T = any>(storeName: string) {
    const store = this.getStore(storeName, 'readonly');
    try {
      return getLatestItemFromDbStore<T>(store);
    } catch {
      return null;
    }
  }

  addBoardState(board: BoardState) {
    this.getStore(BOARD_STORE_NAME, 'readwrite').add(board);
  }

  getBoardState() {
    return this.getStoreState<BoardState>(BOARD_STORE_NAME);
  }
}
