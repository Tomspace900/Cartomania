import { useEffect, useState } from "react";

export function useTimer() {
  const [timer, setTimer] = useState<number>(0);
  // eslint-disable-next-line no-undef
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  const startTimer = () => {
    stopTimer();
    setTimer(0);
    setTimerInterval(
      setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000),
    );
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    };
  }, [timerInterval]);

  return {
    timer,
    startTimer,
    stopTimer,
  };
}
