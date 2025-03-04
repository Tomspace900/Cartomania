import React from 'react';
import { GameCountry, useGameState } from '@/contexts/GameContext';
import { GamePill } from './GamePill';
import MapLoader from './map/MapLoader';

const DefaultGame = () => {
	const { gameCountries } = useGameState();

	const handleCountryClick = (clickedCountry: GameCountry) => {
		console.log('clickedGameCountry', clickedCountry);
	};

	return (
		<div className="flex flex-col w-full h-full items-center gap-4 px-0 md:px-4">
			<GamePill />
			<div className="w-full min-h-[300px] flex-grow">
				<MapLoader
					entityType="country"
					entities={gameCountries}
					detailed
					mapProps={{
						type: 'map',
						onRegionClick: handleCountryClick,
					}}
				/>
			</div>
		</div>
	);
};

export default DefaultGame;
