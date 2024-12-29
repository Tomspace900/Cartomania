import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { Button } from './ui/button';
import { continentCoordinates, formatTimer, getContinentByCode } from '@/lib/utils';
import { Timer, X } from 'lucide-react';
import Map from '@/components/Map';
import { Am5ContinentId, ContinentCode } from '@/ressources/types';
import { useGameState } from '@/contexts/GameContext';
import { isEmpty } from 'lodash';
import { LoadingState } from '@/lib/types';
import { loadGeodata } from '@/ressources/countryUtils';

interface IWinScreenProps {
	continentCode?: ContinentCode;
	gameParams: any;
}

const WinScreen = ({ continentCode, gameParams }: IWinScreenProps) => {
  const [loading, setLoading] = useState<LoadingState>("idle");
  // eslint-disable-next-line no-undef
  const [geoData, setGeoData] = useState<GeoJSON.GeoJSON[]>([]);
  const { initGame, getTimer, totalErrorCount } = useGameState();

	const currentContinent: Am5ContinentId | undefined = getContinentByCode(continentCode)?.am5Id;

	useEffect(() => {
		const fetchGeoData = async () => {
			setLoading('loading');
			const places = ['continents'];
			if (currentContinent) places.push(`region/world/${currentContinent}`);

			try {
				const geoDataResults = await Promise.all(places.map((place) => loadGeodata(place)));
				setGeoData(geoDataResults);
				setLoading('done');
			} catch (error) {
				console.error(error);
				setLoading('failed');
			}
		};

		fetchGeoData();
	}, [currentContinent]);

	const computeRotateTo = (): { longitude: number; latitude: number } =>
		continentCode ? continentCoordinates[continentCode] : { latitude: 0, longitude: 0 };

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
        <div>{`Bravo t'es un(e) chef`}</div>

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
          {loading === "done" && !isEmpty(geoData) && (
            <Map
              type="glob"
              name="win"
              geoData={geoData}
              rotateTo={computeRotateTo()}
              highlightedPolygonId={currentContinent}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default WinScreen;
