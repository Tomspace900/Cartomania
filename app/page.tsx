'use client';

import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { continentCoordinates, getURLFromRegion } from '@/lib/utils';
import { getContinents } from '@/ressources/countryUtils';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Continent } from '@/ressources/types';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/lib/types';
import { loadGeodata } from '@/ressources/countryUtils';

const isMobile = window.innerWidth < 640;

export default function Home() {
	const router = useRouter();
	const continents = getContinents();
	const [loading, setLoading] = useState<LoadingState>('idle');
	const [continentsGeoData, setContinentsGeoData] = useState<GeoJSON.GeoJSON>();
	const [globCoordinates, setGlobCoordinates] = useState<{
		longitude: number;
		latitude: number;
	}>();

	const handleOverLink = (continent: Continent) => {
		setGlobCoordinates(continentCoordinates[continent.code]);
	};

	const handleGlobClick = (event: any) => {
		const id = event.target.dataItem?.dataContext?.id;
		router.push(`game/${getURLFromRegion(id)}/flags`);
	};

	const handleGlobHover = useCallback((event: any) => {
		const type = event.type;
		if (type === 'pointerover') event.target.setAll({ fillOpacity: 1 });
		else event.target.setAll({ fillOpacity: 0.7 });
	}, []);

	useEffect(() => {
		const fetchGeoData = async () => {
			setLoading('loading');

			try {
				const data = await loadGeodata('continents', true);
				setContinentsGeoData(data);
				setLoading('done');
			} catch (error) {
				console.error(error);
				setLoading('failed');
			}
		};

		fetchGeoData();
	}, []);

	return (
		<div className="sm:px-12 px-6 max-w-5xl flex flex-col w-full h-full gap-10">
			<div className="flex flex-col gap-6 justify-center items-center">
				<h1 className="text-2xl">Select a continent...</h1>
				<div className="flex gap-2 flex-wrap justify-center">
					<Button key={'world'} asChild className="hover:scale-[1.02] transition-transform duration-100 ease-in-out">
						<Link href={'/game/world/flags'}>World</Link>
					</Button>
					{continents.map((continent) => (
						<Button
							key={continent.name}
							asChild
							className="hover:scale-[1.02] transition-transform duration-100 ease-in-out"
							onMouseEnter={() => handleOverLink(continent)}
							onMouseLeave={() => setGlobCoordinates(undefined)}
						>
							<Link href={`/game/${getURLFromRegion(continent.name)}/flags`}>{continent.name}</Link>
						</Button>
					))}
				</div>
			</div>

			<div className="flex items-center min-h-[300px] flex-grow">
				{loading === 'done' && continentsGeoData && (
					<div className="w-full h-full max-h-[500px]">
						<Map
							type="glob"
							name="world"
							geoData={[continentsGeoData]}
							animate
							enablePan={isMobile}
							rotateTo={globCoordinates}
							handleClick={handleGlobClick}
							handleHover={handleGlobHover}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
