import { MapEntity, MapEntityType } from '@/components/MapV2';
import { GameCountry } from '@/contexts/GameContext';
import { getContinents, loadContinentGeodata, loadCountryGeodata } from '@/ressources/countryUtils';
import { Continent } from '@/ressources/types';
import { RegionCode } from '@prisma/client';
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

export const isParamMatchAnyContinent = (params?: string): RegionCode | undefined => {
	if (!params) return undefined;
	const continents = getContinents();

	const continent = formatFromURL(params);

	const continentMatch = _.find(continents, (value) => _.includes(continent, value.name.toLowerCase()));

	return continentMatch?.code;
};

export const toMapEntity = (entityType: MapEntityType, entity: any, detailed?: boolean): Promise<MapEntity<any>> => {
	switch (entityType) {
		case 'country':
			return countryToMapEntity(entity, detailed);
		case 'continent':
			return continentToMapEntity(entity, detailed);
		default:
			throw new Error('Invalid entity type');
	}
};

export const countryToMapEntity = async (country: GameCountry, detailed?: boolean): Promise<MapEntity<GameCountry>> => {
	let geoData = null;
	try {
		geoData = await loadCountryGeodata(country.cca2, detailed);
	} catch (error) {
		console.error('Error loading geodata for country', error);
		geoData = null;
	}
	return {
		type: 'country',
		code: country.cca2,
		disabled: country.disabled,
		entity: country,
		geoData,
	};
};

export const continentToMapEntity = async (continent: Continent, detailed?: boolean): Promise<MapEntity<Continent>> => {
	let geoData = null;
	try {
		geoData = await loadContinentGeodata(continent.code, detailed);
	} catch (error) {
		console.error('Error loading geodata for continent', error);
		geoData = null;
	}
	return {
		type: 'continent',
		code: continent.code,
		entity: continent,
		geoData,
	};
};
