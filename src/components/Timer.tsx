import { useEffect, useState } from 'react';
import { GAME_STATE, type GameState } from '../lib/constants/enums';

type TimerProps = {
  start: GameState;
};

export const Timer = ({ start }: TimerProps) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number = 0;
    switch (start) {
      case GAME_STATE.START:
        interval = setInterval(() => {
          setTimer((timer) => timer + 1);
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      case GAME_STATE.WIN:
      case GAME_STATE.LOSE:
        clearInterval(interval);
        break;
      default:
        setTimer(0);
        break;
    }
  }, [start]);

  return <p>Timer: {timer}</p>;
};
