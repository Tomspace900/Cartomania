import { MapEntity } from '@/components/MapV2';
import { GameCountry } from '@/contexts/GameContext';
import { getContinents } from '@/ressources/countryUtils';
import { Continent, ContinentCode } from '@/ressources/types';
import { clsx, type ClassValue } from 'clsx';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTimer(timer?: number): string {
	if (!timer) return '0:00';
	const minutes = Math.floor(timer / 60);
	const seconds = timer % 60;

	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function formatFromURL(region?: string): string | undefined {
	return region?.split('_').join(' ');
}

export function formatToURL(region?: string): string | undefined {
	return region
		?.replace(/(?<=[a-zA-Z0-9])([A-Z])/g, '_$1')
		.split(' ')
		.join('_')
		.toLowerCase();
}

export const isParamMatchAnyContinent = (params?: string): ContinentCode | undefined => {
	if (!params) return undefined;
	const continents = getContinents();

	const continent = formatFromURL(params);

	const continentMatch = _.find(continents, (value) => _.includes(continent, value.name.toLowerCase()));

	return continentMatch?.code;
};

export const countryToMapEntity = (country: GameCountry): MapEntity<GameCountry> => ({
	type: 'country',
	code: country.cca2,
	disabled: country.disabled,
	entity: country,
});

export const continentToMapEntity = (continent: Continent): MapEntity<Continent> => ({
	type: 'continent',
	code: continent.code,
	entity: continent,
});
