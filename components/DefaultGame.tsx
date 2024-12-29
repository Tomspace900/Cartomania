import React, { useEffect, useState } from 'react';
import Map from './Map';
import { loadGeodata } from '@/ressources/countryUtils';
import { useGameState } from '@/contexts/GameContext';
import { getContinentByCode } from '@/lib/utils';
import { GamePill } from './GamePill';

const DefaultGame = () => {
	const [loading, setLoading] = useState('idle');
	const [geoData, setGeoData] = useState<GeoJSON.GeoJSON>();
	const { gameRegion, gameCountries } = useGameState();

	const handleCountryClick = (event: any) => {
		console.log('event', event);
		const id = event.target.dataItem?.dataContext?.id;
		const clickedGameCountry = gameCountries.find((country) => country.cca2 === id);
		console.log('id', id);
		console.log('clickedGameCountry', clickedGameCountry);
	};

	useEffect(() => {
		const fetchGeoData = async () => {
			setLoading('loading');

			const region = gameRegion ? getContinentByCode(gameRegion)?.am5Id : 'world';

			try {
				const data = await loadGeodata(`region/world/${region}`, true);
				setGeoData(data);
				setLoading('done');
			} catch (error) {
				console.error(error);
				setLoading('failed');
			}
		};

		fetchGeoData();
	}, []);

	return (
		loading === 'done' &&
		geoData && (
			<div className="flex flex-col w-full h-full items-center gap-4 px-0 sm:px-4">
				<GamePill />
				<div className="w-full min-h-[300px] flex-grow">
					<Map type="map" name="test" geoData={[geoData]} enablePan enableZoom handleClick={handleCountryClick} />
				</div>
			</div>
		)
	);
};

export default DefaultGame;
