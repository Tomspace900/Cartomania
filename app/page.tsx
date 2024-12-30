'use client';

import { Button } from '@/components/ui/button';
import { formatToURL } from '@/lib/utils';
import { getContinentByCode, getContinents } from '@/ressources/countryUtils';
import Link from 'next/link';
import { useState } from 'react';
import { Continent } from '@/ressources/types';
import { useRouter } from 'next/navigation';
import MapLoader from '@/components/MapLoader';

const isMobile = window.innerWidth < 640;

export default function Home() {
	const router = useRouter();
	const continents = getContinents();
	const [globCoordinates, setGlobCoordinates] = useState<{
		longitude: number;
		latitude: number;
	}>();

	const handleOverLink = (continent: Continent) => {
		setGlobCoordinates(continent.latLng);
	};

	const handleGlobClick = (continent: Continent) => {
		const id = continent.code;
		router.push(`game/${formatToURL(getContinentByCode(id)?.name)}/flags`);
	};

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
							<Link href={`/game/${formatToURL(continent.name)}/flags`}>{continent.name}</Link>
						</Button>
					))}
				</div>
			</div>

			<div className="flex items-center min-h-[300px] flex-grow">
				<div className="w-full h-full max-h-[500px]">
					<MapLoader
						entityType="continent"
						entities={continents}
						mapProps={{
							type: 'glob',
							name: 'world',
							animate: true,
							enablePan: isMobile,
							rotateTo: globCoordinates,
							handleClick: handleGlobClick,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
