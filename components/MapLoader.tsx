import React, { useEffect, useState } from 'react';
import { LoadingState } from '@/lib/types';
import MapV2, { IMapProps, MapEntity, MapEntityType } from './MapV2';
import _ from 'lodash';
import { toMapEntity } from '@/lib/utils';
import Loader from './Loader';

interface MapContainerProps<T> {
	entityType: MapEntityType;
	entities: T[];
	mapProps: Omit<IMapProps<T>, 'mapEntities'>;
	detailed?: boolean;
}

const MapLoader = <T,>({ entityType, entities, mapProps, detailed }: MapContainerProps<T>) => {
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
			{loading === 'done' && !_.isEmpty(mapEntities) ? (
				<MapV2 {...mapProps} mapEntities={mapEntities} />
			) : (
				<Loader text="" />
			)}
		</div>
	);
};

export default MapLoader;
