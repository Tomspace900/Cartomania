import continents from './continents.json';
import { Continent, ContinentCode, Country, CountryCode } from './types';

export const getCountries = async () =>
	fetch('/api/data/country').then((res) => {
		const countries = res.json();
		if (!countries) return [];
		return countries as Promise<Country[]>;
	});

// export const getContinents = async () =>
// 	fetch('/api/data/continent').then((res) => {
// 		const continents = res.json();
// 		if (!continents) return [];
// 		return continents as Promise<Continent[]>;
// 	});

// ! Pour l'instant les continents on va les garder en front
export const getContinents = () => continents as unknown as Continent[];

export const getUNMembersCountries = (): Promise<Country[]> =>
	getCountries().then((res) => res.filter((country) => country.UNMember));

export const getCountryByCode = (code: CountryCode): Promise<Country | undefined> =>
	getCountries().then((res) => res.find((country) => country.cca3 === code));

export const getContinentByCode = (code?: ContinentCode, continents?: Continent[]) => {
	if (!code) return undefined;
	const allContinents = continents || getContinents();
	return allContinents.find((continent) => continent.code === code);
};

export const loadCountryGeodata = async (
	cca2: CountryCode | ContinentCode,
	detailed: boolean = false,
	extended: boolean = false
): Promise<GeoJSON.FeatureCollection> => {
	const resolution = detailed ? 'high' : 'low';

	try {
		const response = await fetch(`/api/geodata/country/${cca2}?resolution=${resolution}${extended ? '&extended=true' : ''}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch geodata: ${response.statusText}`);
		}

		const geoData: GeoJSON.FeatureCollection = await response.json();

		return geoData;
	} catch (error) {
		console.error(`Error loading geodata for ${cca2}`, error);
		throw error;
	}
};

export const loadContinentGeodata = async (
	code: ContinentCode,
	detailed: boolean = false
): Promise<GeoJSON.FeatureCollection> => {
	const resolution = detailed ? 'high' : 'low';

	if (!code) {
		throw new Error('Invalid continent code');
	}

	try {
		const response = await fetch(`/api/geodata/continent/${code}?resolution=${resolution}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch geodata: ${response.statusText}`);
		}

		const geoData: GeoJSON.FeatureCollection = await response.json();

		return geoData;
	} catch (error) {
		console.error(`Error loading geodata for continent ${code}`, error);
		throw error;
	}
};

export const loadWorldGeodata = async (detailed: boolean = false): Promise<GeoJSON.FeatureCollection> => {
	const resolution = detailed ? 'high' : 'low';

	try {
		const response = await fetch(`/api/geodata/world?resolution=${resolution}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch geodata: ${response.statusText}`);
		}

		const geoData: GeoJSON.FeatureCollection = await response.json();

		return geoData;
	} catch (error) {
		console.error('Error loading geodata for world', error);
		throw error;
	}
};

// export const loadAm5Geodata = async (path: string, detailed: boolean = false): Promise<GeoJSON.FeatureCollection> => {
// 	const res = detailed ? 'High' : 'Low';

// 	try {
// 		const response = await fetch(`https://www.amcharts.com/lib/5/geodata/json/${path}${res}.json`);

// 		if (!response.ok) {
// 			throw new Error(`Failed to fetch geodata: ${response.statusText}`);
// 		}

// 		const geoData: GeoJSON.FeatureCollection = await response.json();

// 		return geoData;
// 	} catch (error) {
// 		console.error(`Error loading geodata for ${path}`, error);
// 		throw error;
// 	}
// };
