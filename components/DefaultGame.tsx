import React from 'react';
import MapV2 from './MapV2';
import { GameCountry, useGameState } from '@/contexts/GameContext';
import { GamePill } from './GamePill';
import { countryToMapEntity } from '@/lib/utils';

const DefaultGame = () => {
	const { gameCountries } = useGameState();

	const handleCountryClick = (clickedCountry: GameCountry) => {
		console.log('clickedGameCountry', clickedCountry);
	};

	return (
		<div className="flex flex-col w-full h-full items-center gap-4 px-0 sm:px-4">
			<GamePill />
			<div className="w-full min-h-[300px] flex-grow">
				<MapV2
					type="map"
					name="default"
					entities={gameCountries.map((c) => countryToMapEntity(c))}
					center={{ latitude: 45, longitude: 200 }}
					enablePan
					enableZoom
					handleClick={handleCountryClick}
				/>
			</div>
		</div>
	);
};

export default DefaultGame;
