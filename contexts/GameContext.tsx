'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Country } from '@/ressources/types';
import _ from 'lodash';
import { getCountries, getUNMembersCountries } from '@/ressources/countryUtils';
import { useTimer } from '@/hooks/useTimer';
import { redirect } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { GameType, RegionCode, Score } from '@prisma/client';
import { createScore, updateScore } from '@/api/score';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Crown, Eraser } from 'lucide-react';

export enum GameMode {
	FLAGS = 'flags',
	CAPITALS = 'capitals',
	DEFAULT = 'default',
}

export const gameModeMap: Record<GameMode, GameType> = {
	flags: GameType.FLAGS,
	capitals: GameType.CAPITALS,
	default: GameType.LOCATION,
};

export type IGameLoadingState = 'idle' | 'loading' | 'loaded' | 'playing' | 'win' | 'lose' | 'error';

export type QuestionStatus = 'idle' | 'correct' | 'incorrect';

export type GameCountry = Country & { disabled: boolean };

export interface GameParams {
	mode: GameMode;
	regionCode?: RegionCode;
	UNMembersOnly?: boolean;
}

interface IGameContext {
	gameMode?: GameMode;
	gameState: IGameLoadingState;
	adminMenu: React.ReactNode;
	questionStatus: QuestionStatus;
	currentScore: Score | null;
	gameRegion?: RegionCode;
	gameCountries: GameCountry[];
	askedCountry?: GameCountry;
	getTimer: () => number;
	initGame: (gameParams: GameParams) => void;
	startGame: () => void;
	handleClickedCountry: (country: GameCountry) => QuestionStatus;
	getRandomCountry: (countries: GameCountry[]) => GameCountry;
}

const initialState: IGameContext = {
	gameMode: GameMode.DEFAULT,
	gameState: 'idle',
	adminMenu: null,
	questionStatus: 'idle',
	currentScore: null,
	gameRegion: undefined,
	gameCountries: [],
	askedCountry: undefined,
	getTimer: () => 0,
	initGame: () => {},
	startGame: () => {},
	handleClickedCountry: () => 'idle',
	getRandomCountry: () => ({}) as GameCountry,
};

const GameContext = createContext<IGameContext>(initialState);

export function GameProvider({ children, ...props }: { children: React.ReactNode }) {
	const [gameMode, setGameMode] = useState<GameMode>();
	const [gameState, setGameState] = useState<IGameLoadingState>('idle');
	const [gameRegion, setGameRegion] = useState<RegionCode>();
	const [gameCountries, setGameCountries] = useState<GameCountry[]>([]);
	const [askedCountry, setAskedCountry] = useState<GameCountry>();
	const [questionStatus, setQuestionStatus] = useState<QuestionStatus>('idle');
	const [errorCount, setErrorCount] = useState(0);
	const [totalErrorCount, setTotalErrorCount] = useState(0);
	const [currentScore, setCurrentScore] = useState<Score | null>(null);
	const { getTimer, startTimer, stopTimer } = useTimer();
	const { toast } = useToast();
	const { user, isAdmin } = useUser();
	const userId = user?.id;

	const getRandomCountry = useCallback((countries: GameCountry[]): GameCountry => {
		return _.sample(countries) as GameCountry;
	}, []);

	// Init game with the given parameters
	const initGame = ({ mode, regionCode, UNMembersOnly }: GameParams) => {
		setGameState('loading');

		const countriesToFecth = UNMembersOnly ? getUNMembersCountries() : getCountries();

		countriesToFecth.then((countries) => {
			const filteredCountries = regionCode
				? countries.filter((country) => country.continent.code === regionCode)
				: countries;

			const shuffledCountries: Country[] = _.shuffle(filteredCountries);
			const shuffledGameCountries: GameCountry[] = shuffledCountries.map((country) => ({
				...country,
				disabled: false,
			}));

			if (shuffledGameCountries.length === 0) {
				setGameState('error');
				return;
			}

			setGameMode(mode);
			setErrorCount(0);
			setTotalErrorCount(0);
			setGameRegion(regionCode);
			setGameCountries(shuffledGameCountries);
			setAskedCountry(getRandomCountry(shuffledGameCountries));
			setGameState('loaded');
		});
	};

	// Start the game
	const startGame = () => {
		setGameState('playing');
		startTimer();
		initScore();
	};

	const initScore = useCallback(async () => {
		if (!userId || !gameMode || !gameRegion) return;

		try {
			await createScore({
				userId,
				gameType: gameModeMap[gameMode],
				regionCode: gameRegion,
				time: 0,
				errors: 0,
				completed: false,
			}).then((score) => setCurrentScore(score));
		} catch (error) {
			console.error('Failed to initialize score:', error);
		}
	}, [userId, gameMode, gameRegion]);

	const updateCurrentScore = useCallback(
		async (completed: boolean) => {
			if (!currentScore?.id) return;

			try {
				await updateScore(currentScore.id, {
					time: getTimer(),
					errors: totalErrorCount,
					completed,
				}).then((score) => setCurrentScore(score));
			} catch (error) {
				console.error('Failed to update score:', error);
				toast({
					variant: 'destructive',
					title: 'Oups ! 😅',
					description: "Ton score n'a pas pu être enregistré, désolé\u00A0!",
				});
			}
		},
		[currentScore, getTimer, totalErrorCount]
	);

	// Handle the click on a country (flag/location)
	const handleClickedCountry = (country: GameCountry): QuestionStatus => {
		if (!askedCountry) return 'idle';
		if (country.cca3 === askedCountry.cca3) {
			setErrorCount(0);
			setQuestionStatus('correct');
			const newGameCountries = gameCountries.filter((c) => c.cca3 !== country.cca3);
			setTimeout(() => {
				setGameCountries(newGameCountries);
				setAskedCountry(getRandomCountry(newGameCountries));
				setQuestionStatus('idle');
			}, 500);
			return 'correct';
		} else {
			setErrorCount((prev) => prev + 1);
			setTotalErrorCount((prev) => prev + 1);
			setQuestionStatus('incorrect');
			setTimeout(() => setQuestionStatus('idle'), 500);
			return 'incorrect';
		}
	};

	// Handle the error count & disable countries to help the player
	useEffect(() => {
		switch (errorCount) {
			case 1:
			case 2: {
				// Disable half of the wrong countries not disabled
				const enabledCountries = gameCountries.filter((c) => !c.disabled && c.cca3 !== askedCountry?.cca3);
				const toDisableCount = Math.floor(enabledCountries.length / 2);
				const shuffled = _.shuffle(enabledCountries).slice(0, toDisableCount);

				setGameCountries((prev) =>
					prev.map((country) =>
						shuffled.some((c) => c.cca3 === country.cca3) ? { ...country, disabled: true } : country
					)
				);
				break;
			}
			case 3: {
				// Disable all the wrong countries
				setGameCountries((prev) =>
					prev.map((country) => (country.cca3 === askedCountry?.cca3 ? country : { ...country, disabled: true }))
				);
				break;
			}
			default: {
				// Enable all the countries
				setGameCountries((prev) => prev.map((country) => ({ ...country, disabled: false })));
				break;
			}
		}
	}, [errorCount, setGameCountries, askedCountry]);

	// Handle the global game state
	useEffect(() => {
		if (gameState === 'win') {
			stopTimer();
			updateCurrentScore(gameCountries.length === 0);
		}
		if (gameState === 'lose') {
			stopTimer();
			updateCurrentScore(false);
		}
		if (gameState === 'playing' && gameCountries.length === 0) {
			setGameState('win');
		}
		if (gameState === 'error') {
			stopTimer();
			toast({
				variant: 'destructive',
				title: 'Oups ! 😅',
				description: "Tout ne s'est pas passé comme prévu, désolé\u00A0!",
			});
			redirect('/');
		}
	}, [gameState, gameCountries]);

	// Handle the current score when the user leaves the page
	useEffect(() => {
		const handleBeforeUnload = () => {
			if (gameState === 'playing' && currentScore) {
				updateCurrentScore(false);
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			if (gameState === 'playing') {
				handleBeforeUnload();
			}
		};
	}, [gameState, currentScore, updateCurrentScore]);

	// Admin menu
	const adminMenuContent = (
		<div className="flex flex-col gap-2 absolute top-0 right-2">
			<Button onClick={() => setGameState('win')} className="bg-yellow-300 text-foreground hover:bg-yellow-400">
				<Crown className="mr-2" />
				Win
			</Button>
			<Button onClick={() => setGameState('lose')} className="bg-red-300 text-foreground hover:bg-red-400">
				<Eraser className="mr-2" />
				Lose
			</Button>
			<Button onClick={() => setErrorCount(0)} className="bg-orange-300 text-foreground hover:bg-orange-400">
				<Eraser className="mr-2" />
				Reset errors
			</Button>
		</div>
	);

	const value: IGameContext = {
		gameMode,
		gameState,
		adminMenu: isAdmin ? adminMenuContent : null,
		questionStatus,
		currentScore,
		gameRegion,
		gameCountries,
		askedCountry,
		getTimer,
		initGame,
		startGame,
		handleClickedCountry,
		getRandomCountry,
	};

	return (
		<GameContext.Provider {...props} value={value}>
			{children}
		</GameContext.Provider>
	);
}

export const useGameState = () => {
	const context = useContext(GameContext);

	if (context === undefined) throw new Error('useGameState must be used within a GameProvider');

	return context;
};
