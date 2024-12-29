import { continents } from './continents';
import { countries } from './countries';
import { Continent, Country } from './types';

// ! Ça c'est deg mais on va faire ça proprement côté serveur api
export const getCountries = (): Country[] => countries;

// ! Ça c'est deg mais on va faire ça proprement côté serveur api
export const getContinents = (): Continent[] => continents;

export const loadGeodata = async (path: string, detailed: boolean = false): Promise<GeoJSON.FeatureCollection> => {
	const script = document.createElement('script');
	const res = detailed ? 'High' : 'Low';

	try {
		script.src = `https://www.amcharts.com/lib/5/geodata/${path}${res}.js`;
		script.async = true;

		const data = new Promise<GeoJSON.FeatureCollection>((resolve, reject) => {
			script.onload = () => {
				const geoData =
					// @ts-expect-error: Accessing global variable
					window[`am5geodata_${path.replaceAll('/', '_')}${res}`];
				if (geoData) {
					console.log('loadGeodata', geoData);
					resolve(geoData);
				} else {
					reject(new Error(`No data found for ${path}`));
				}
			};
			script.onerror = () => {
				reject(new Error(`Failed to load script: ${script.src}`));
			};
		});

		document.body.appendChild(script);
		return await data;
	} finally {
		// Clean up script if needed
		document.body.removeChild(script);
	}
};
