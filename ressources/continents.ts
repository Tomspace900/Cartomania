import { Continent } from './types';

const continents: Continent[] = [
	{
		name: 'Africa',
		code: 'AF',
		latLng: {
			latitude: 7.5,
			longitude: 20.0,
		},
	},
	{
		name: 'Antarctica',
		code: 'AN',
		latLng: {
			latitude: -85.0,
			longitude: 0.0,
		},
	},
	{ name: 'Asia', code: 'AS', latLng: { latitude: 31.0, longitude: 90.0 } },
	{
		name: 'Europe',
		code: 'EU',
		latLng: {
			latitude: 54.0,
			longitude: 25.0,
		},
	},
	{
		name: 'North America',
		code: 'NA',
		latLng: {
			latitude: 40.0,
			longitude: -100.0,
		},
	},
	{
		name: 'Oceania',
		code: 'OC',
		latLng: {
			latitude: -25.0,
			longitude: 135.0,
		},
	},
	{
		name: 'South America',
		code: 'SA',
		latLng: {
			latitude: -15.0,
			longitude: -60.0,
		},
	},
];

export default continents;
