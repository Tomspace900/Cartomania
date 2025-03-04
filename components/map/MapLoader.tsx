import React, { useEffect, useState } from 'react';
import { LoadingState } from '@/lib/types';
import Map, { IMapProps, MapEntity, MapEntityType } from './Map';
import _ from 'lodash';
import { toMapEntity } from '@/lib/utils';
import Loader from '../Loader';
import { Continent, Country } from '@/ressources/types';

interface MapContainerProps<T> {
	entityType: MapEntityType;
	entities: T[];
	mapProps: Omit<IMapProps<T>, 'mapEntities'>;
	detailed?: boolean;
}

const MapLoader = <T extends Country | Continent>({ entityType, entities, mapProps, detailed }: MapContainerProps<T>) => {
	const [loading, setLoading] = useState<LoadingState>('idle');
	const [mapEntities, setMapEntities] = useState<MapEntity<T>[]>([]);

	useEffect(() => {
		const fetchGeoData = async () => {
			setLoading('loading');
			try {
				const allEntitiesWithGeoData = await Promise.all(
					entities.map(async (entity) => (await toMapEntity(entityType, entity, detailed)) as MapEntity<T>)
				);
				setMapEntities(allEntitiesWithGeoData);
				setLoading('done');
			} catch (error) {
				console.error(error);
				setLoading('failed');
			}
		};
		fetchGeoData();
	}, [entityType, entities]);

	return (
		<div className="w-full h-full">
			{loading === 'done' && !_.isEmpty(mapEntities) ? <Map {...mapProps} mapEntities={mapEntities} /> : <Loader text="" />}
		</div>
	);
};

export default MapLoader;
