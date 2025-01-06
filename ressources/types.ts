import { RegionCode } from '@prisma/client';

export interface Country {
	name: {
		common: string;
		official: string;
		native: {
			common: string;
			official: string;
		};
	};
	tld: string[];
	cca2: string;
	ccn3: string;
	cca3: CountryCode;
	currency: string[];
	callingCode: string[];
	capital: string;
	altSpellings: string[];
	relevance: string;
	subregion: string;
	nativeLanguage: LanguageCode;
	languages: Record<LanguageCode, string>;
	translations: Record<LanguageCode, string>;
	latlng: [number, number];
	demonym: string;
	borders: CountryCode[];
	area: number;
	UNMember: boolean;
	continent: Continent;
}

export interface Continent {
	name: ContinentName;
	code: RegionCode;
	latLng: {
		latitude: number;
		longitude: number;
	};
}

export type ContinentName = 'Africa' | 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'South America' | 'Antarctica';

export type CountryCode = string;
export type LanguageCode = string;
