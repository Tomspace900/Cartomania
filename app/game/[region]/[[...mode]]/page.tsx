'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { GameMode, GameParams, useGameState } from '@/contexts/GameContext';
import { isParamMatchAnyContinent } from '@/lib/utils';
import WinScreen from '@/components/WinScreen';
import FlagsGame from '@/components/FlagsGame';
import DefaultGame from '@/components/DefaultGame';

const Game = () => {
	const params = useParams<{ region: string; mode?: string[] }>();
	const router = useRouter();
	const [validMode, setValidMode] = useState<GameMode>();
	const [gameParams, setGameParams] = useState<GameParams>();

	const clearUrl = (mode?: string) => router.push(`/game/${params.region}/${mode || 'default'}`);

	useEffect(() => {
		if (!params.mode) clearUrl();
		else if (!Object.values(GameMode).includes(params.mode[0] as GameMode)) clearUrl();
		else if (params.mode.length > 1) clearUrl(params.mode[0]);
		else setValidMode(params.mode[0] as GameMode);
	}, [params, router]);

	const regionCode = isParamMatchAnyContinent(params.region);
	const { gameState, initGame } = useGameState();

	useEffect(() => {
		if (validMode)
			setGameParams({
				mode: validMode,
				regionCode,
				UNMembersOnly: validMode === GameMode.FLAGS, // ! permettre vrai seulement sur les drapeaux pas les cartes
			});
	}, [validMode]);

	useEffect(() => {
		if (gameParams) initGame(gameParams);
	}, [gameParams]);

	if (!gameParams) return <Loader />;

	switch (gameState) {
		case 'error':
		case 'loading':
			return <Loader />;

		// Pas encore de cas de défaite
		case 'lose':
			return <div className="flex justify-center items-center mt-10 text-2xl">Perdu mon chef</div>;

		case 'win':
			return <WinScreen gameParams={gameParams} />;

		case 'loaded':
		case 'playing':
			return params.mode && params.mode[0] === 'flags' ? <FlagsGame /> : <DefaultGame />;

		default:
			return null;
	}
};

export default Game;
