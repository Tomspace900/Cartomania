import { useCallback, useEffect, useRef } from 'react';

export function useTimer() {
	const timerRef = useRef(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const getTimer = useCallback(() => timerRef.current, []);

	const startTimer = useCallback(() => {
		stopTimer();
		timerRef.current = 0;
		intervalRef.current = setInterval(() => {
			timerRef.current += 1;
		}, 1000);
	}, []);

	const stopTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	return {
		getTimer,
		startTimer,
		stopTimer,
	};
}
