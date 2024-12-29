import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { Button } from './ui/button';
import { formatTimer } from '@/lib/utils';
import { Timer, X } from 'lucide-react';
import { ContinentCode } from '@/ressources/types';
import { GameParams, useGameState } from '@/contexts/GameContext';
import { isEmpty } from 'lodash';
import { LoadingState } from '@/lib/types';
import { getContinentByCode, loadContinentGeodata, loadWorldGeodata } from '@/ressources/countryUtils';
import Map from './Map';

interface IWinScreenProps {
	continentCode?: ContinentCode;
	gameParams: GameParams;
}

const WinScreen = ({ continentCode, gameParams }: IWinScreenProps) => {
	const [loading, setLoading] = useState<LoadingState>('idle');
	const [geoData, setGeoData] = useState<GeoJSON.GeoJSON[]>([]);
	const { initGame, getTimer, totalErrorCount } = useGameState();

	useEffect(() => {
		const fetchGeoData = async () => {
			setLoading('loading');

			try {
				const allGeoData = await Promise.all([
					loadWorldGeodata(),
					continentCode ? loadContinentGeodata(continentCode) : Promise.resolve({} as GeoJSON.FeatureCollection),
				]);
				setGeoData(allGeoData);
				setLoading('done');
			} catch (error) {
				console.error(error);
				setLoading('failed');
			}
		};

		fetchGeoData();
	}, [continentCode]);

	const computeRotateTo = (): { longitude: number; latitude: number } =>
		getContinentByCode(continentCode)?.latLng || { latitude: 0, longitude: 0 };

	return (
		<>
			<ReactConfetti
				height={document.documentElement.scrollHeight}
				width={window.innerWidth}
				recycle={false}
				numberOfPieces={1000}
				gravity={0.2}
			/>
			<div className="flex flex-col h-full justify-center items-center mt-10 text-2xl gap-4">
				<div>{"Bravo t'es un(e) chef"}</div>

				<div className="flex items-center gap-2">
					<Timer className="h-8 w-8" />
					{formatTimer(getTimer())}
				</div>

				<div className="flex items-center gap-2">
					<X className="h-8 w-8" />
					{`${totalErrorCount} errors`}
				</div>
				<Button className="mt-10" onClick={() => initGame(gameParams)}>
					Rejouer
				</Button>
				<div className="max-w-full w-[400px] min-h-[300px] flex-grow">
					{loading === 'done' && !isEmpty(geoData) && (
						<Map
							type="glob"
							name="win"
							geoData={geoData}
							rotateTo={computeRotateTo()}
							highlightedPolygonId={continentCode}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default WinScreen;
