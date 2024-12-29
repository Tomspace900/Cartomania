'use server';

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

type RouteType = 'world' | 'country' | 'continent';
type RouteConfig = {
	folder: string;
	validateParams?: (params: string[]) => boolean;
	getFileName: (params: string[], extended?: boolean) => string;
	getErrorMessage: (params: string[]) => string;
};

const routeConfigs: Record<RouteType, RouteConfig> = {
	world: {
		folder: 'world',
		getFileName: () => 'world.geojson',
		getErrorMessage: () => 'GeoJSON file for world not found',
	},
	country: {
		folder: 'countries',
		validateParams: (params) => params.length === 1 && params[0].length === 2,
		getFileName: (params, extended) => `${params[0].toUpperCase()}${extended ? '_Extended' : ''}.geojson`,
		getErrorMessage: (params) => `GeoJSON file for code ${params[0]} not found`,
	},
	continent: {
		folder: 'continents',
		validateParams: (params) => params.length === 1 && params[0].length === 2,
		getFileName: (params) => `${params[0].toUpperCase()}.geojson`,
		getErrorMessage: (params) => `GeoJSON file for continent code ${params[0]} not found`,
	},
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: RouteType; params?: string[] }> }) {
	const { type, params: routeParams = [] } = await params;
	const url = new URL(request.url);
	const resolution = url.searchParams.get('resolution') || 'low';
	const extended = url.searchParams.get('extended') === 'true';

	// Validate route type
	if (!routeConfigs[type]) {
		return NextResponse.json({ error: 'Invalid route type' }, { status: 400 });
	}

	// Validate resolution
	if (resolution !== 'low' && resolution !== 'high') {
		return NextResponse.json({ error: 'Invalid resolution' }, { status: 400 });
	}

	const config = routeConfigs[type];

	// Validate parameters if needed
	if (config.validateParams && !config.validateParams(routeParams)) {
		return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
	}

	try {
		const fileName = config.getFileName(routeParams, extended);
		const filePath = path.join(process.cwd(), 'ressources', 'geodata', 'dataset', resolution, config.folder, fileName);

		const fileContent = await fs.readFile(filePath, 'utf-8');
		const geoJson: GeoJSON.FeatureCollection = JSON.parse(fileContent);

		if (geoJson.type !== 'FeatureCollection') {
			return NextResponse.json({ error: 'Invalid GeoJSON format' }, { status: 500 });
		}

		return NextResponse.json(geoJson);
	} catch (error: any) {
		if (error.code === 'ENOENT') {
			return NextResponse.json({ error: config.getErrorMessage(routeParams) }, { status: 404 });
		} else {
			return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
		}
	}
}
