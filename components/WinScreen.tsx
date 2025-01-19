import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { Button } from './ui/button';
import { gameModeMap, GameParams, useGameState } from '@/contexts/GameContext';
import { isEmpty } from 'lodash';
import { LoadingState } from '@/lib/types';
import { getContinentByCode, loadContinentGeodata, loadWorldGeodata } from '@/ressources/countryUtils';
import Map from './Map';
import { getTopScores, TopScore } from '@/services/score';
import TopScores from './TopScores';

interface IWinScreenProps {
	gameParams: GameParams;
}

const WinScreen = ({ gameParams }: IWinScreenProps) => {
	const { regionCode, mode } = gameParams;
	const [loading, setLoading] = useState<LoadingState>('idle');
	const [geoData, setGeoData] = useState<GeoJSON.GeoJSON[]>([]);
	const { initGame, currentScore } = useGameState();
	const [topScores, setTopScores] = useState<TopScore[]>();

	useEffect(() => {
		const fetchTopScores = async () => {
			if (regionCode) getTopScores(gameModeMap[mode], regionCode).then((scores) => setTopScores(scores));
		};

		const fetchGeoData = async () => {
			const worldGeoData = await loadWorldGeodata();
			const continentGeoData = regionCode ? await loadContinentGeodata(regionCode) : ({} as GeoJSON.FeatureCollection);
			setGeoData([worldGeoData, continentGeoData]);
		};

		const fetchData = async () => {
			setLoading('loading');

			try {
				Promise.all([fetchTopScores(), fetchGeoData()]).then(() => setLoading('done'));
			} catch (error) {
				console.error(error);
				setLoading('failed');
			}
		};

		fetchData();
	}, [regionCode]);

	const computeRotateTo = (): { longitude: number; latitude: number } =>
		getContinentByCode(regionCode)?.latLng || { latitude: 0, longitude: 0 };

	return (
		<>
			<ReactConfetti
				height={document.documentElement.scrollHeight}
				width={window.innerWidth}
				recycle={false}
				numberOfPieces={400}
				gravity={0.1}
			/>
			<div className="flex flex-col h-full justify-center items-center text-2xl gap-4">
				<h1 className="text-4xl font-mea-culpa text-primary dark:text-white my-2">Well done!</h1>

				<TopScores topScores={topScores} currentScore={currentScore} />

				<Button onClick={() => initGame(gameParams)}>Rejouer</Button>
				<div className="max-w-full w-[400px] min-h-[300px] flex-grow">
					{loading === 'done' && !isEmpty(geoData) && (
						<Map
							type="glob"
							name="win"
							geoData={geoData}
							rotateTo={computeRotateTo()}
							highlightedPolygonId={regionCode}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default WinScreen;
