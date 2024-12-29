'use client';

import { useGameState } from "@/contexts/GameContext";
import { Clock } from "lucide-react";
import { formatTimer } from "@/lib/utils";
import { useEffect, useState } from "react";

export const GamePill = () => {
  const { askedCountry, questionStatus, getTimer, gameState, startGame } =
    useGameState();
  const [displayTime, setDisplayTime] = useState(0);

	const isLoaded = gameState === 'loaded';
	const isPlaying = gameState === 'playing' && askedCountry;

	const handleClick = () => {
		if (isLoaded) startGame();
	};

  useEffect(() => {
    const updateInterval = setInterval(() => {
      console.log("updateInterval", getTimer());
      setDisplayTime(getTimer());
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [getTimer]);

  const DesktopTimer = () => (
    <div className="absolute left-[100%] sm:flex hidden items-center h-full ml-6">
      <div className="flex justify-center rounded-full border backdrop-blur-sm px-1 py-1 bg-input/[0.8] dark:bg-background/[0.8] border-primary">
        <div className="flex justify-center items-center gap-2 w-[100px]">
          <Clock className="h-5 w-5" />
          <span className="text-xl">{formatTimer(displayTime)}</span>
        </div>
      </div>
    </div>
  );

  const MobileTimer = () => (
    <div className="sm:hidden flex items-center gap-1">
      <Clock className="h-4 w-4" />
      <span className="text-md">{formatTimer(displayTime)}</span>
    </div>
  );

	const StartButton = () => (
		<div className={pillClasses} onClick={handleClick}>
			<span className="text-2xl">Start</span>
		</div>
	);

	const basePillClasses = 'flex justify-center rounded-full border backdrop-blur-sm px-8 sm:py-3 py-1';
	const errorPillClasses = 'bg-destructive text-destructive-foreground border-red';
	const successPillClasses = 'bg-success text-success-foreground border-green';
	const defaultPillClasses = 'bg-input/[0.8] dark:bg-background/[0.8] border-primary';
	const startButtonClasses =
		'cursor-pointer hover:bg-primary hover:dark:bg-secondary hover:text-primary-foreground transition-colors duration-200 ease-in-out';

	const pillClasses = `${basePillClasses} ${questionStatus === 'incorrect' ? errorPillClasses : questionStatus === 'correct' ? successPillClasses : defaultPillClasses} ${isLoaded ? startButtonClasses : ''}`;

	return (
		<div className="fixed top-8 w-fit z-50 flex gap-4">
			{isLoaded && <StartButton />}
			{isPlaying && (
				<>
					<div className={pillClasses}>
						<div className="flex flex-col justify-center items-center">
							<span className="text-2xl">{askedCountry.name.common}</span>
							<MobileTimer />
						</div>
					</div>
					{isPlaying && <DesktopTimer />}
				</>
			)}
		</div>
	);
};
