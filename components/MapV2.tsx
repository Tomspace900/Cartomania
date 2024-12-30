'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

type MapType = 'map' | 'glob';

export type MapEntityType = 'country' | 'continent';

export interface MapEntity<T> {
	type: MapEntityType;
	code: string;
	disabled?: boolean;
	entity: T;
	geoData: GeoJSON.FeatureCollection | null;
}

export interface IMapProps<T> {
	type: MapType;
	name: string;
	mapEntities: MapEntity<T>[];
	animate?: boolean;
	center?: { longitude: number; latitude: number };
	rotateTo?: { longitude: number; latitude: number };
	zoom?: number;
	enableZoom?: boolean;
	enablePan?: boolean;
	handleClick?: (entity: T) => void;
	handleHover?: (entity: T | null) => void;
	highlightedEntityCode?: string;
}

const MapV2 = <T,>({
	type,
	name,
	mapEntities,
	animate,
	center,
	rotateTo,
	zoom = 1,
	enableZoom = false,
	enablePan = false,
	handleClick,
	handleHover,
	highlightedEntityCode,
}: IMapProps<T>) => {
	const chartRef = useRef<am5map.MapChart | null>(null);
	const rootRef = useRef<am5.Root | null>(null);
	const currentRotation = useRef({ rotationX: 0, rotationY: 0 });
	const isClickable = !!handleClick;

	useLayoutEffect(() => {
		// Only create a new root if one doesn't exist
		if (!rootRef.current) {
			rootRef.current = am5.Root.new(name);
			rootRef.current.setThemes([am5themes_Animated.new(rootRef.current)]);
		}

		const root = rootRef.current;

		const chart = root.container.children.push(
			am5map.MapChart.new(root, {
				panX: enablePan ? (type === 'glob' ? 'rotateX' : 'translateX') : 'none',
				panY: enablePan ? (type === 'glob' ? 'rotateY' : 'translateY') : 'none',
				projection: type === 'map' ? am5map.geoMercator() : am5map.geoOrthographic(),
				wheelY: enableZoom ? 'zoom' : 'none',
				wheelX: 'none',
				pinchZoom: enableZoom,
			})
		);

		chartRef.current = chart;

		// Basic settings
		chart.set('zoomLevel', zoom);
		chart.set('maxZoomLevel', 32);
		chart.set('minZoomLevel', 1);

		// Background fill for globe
		if (type === 'glob') {
			const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
			backgroundSeries.mapPolygons.template.setAll({
				fill: am5.color('#8066d6'),
				fillOpacity: 0.1,
				strokeOpacity: 0,
			});
			backgroundSeries.data.push({
				geometry: am5map.getGeoRectangle(90, 180, -90, -180),
			});
		}

		// Graticules
		const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
		graticuleSeries.mapLines.template.setAll({
			stroke: am5.color('#8066d6'),
			strokeOpacity: 0.08,
		});

		// Add countries
		mapEntities.forEach((entity) => {
			if (!entity.geoData) return;

			const polygonSeries = chart.series.push(
				am5map.MapPolygonSeries.new(root, {
					geoJSON: entity.geoData,
				})
			);

			polygonSeries.mapPolygons.template.setAll({
				fill: entity.disabled ? am5.color('#cccccc') : am5.color('#8066d6'),
				fillOpacity: highlightedEntityCode === entity.code ? 1 : 0.7,
				strokeWidth: 0.25,
				stroke: am5.color('#ffffff'),
				interactive: !entity.disabled,
				cursorOverStyle: isClickable && !entity.disabled ? 'pointer' : 'default',
			});

			// Add hover effects
			if (handleHover) {
				polygonSeries.mapPolygons.template.events.on('pointerover', () => {
					handleHover(entity.entity);
				});
				polygonSeries.mapPolygons.template.events.on('pointerout', () => handleHover(null));
			}

			// Add click event
			if (isClickable && !entity.disabled) {
				polygonSeries.mapPolygons.template.events.on('click', () => handleClick(entity.entity), { priority: 1 });
				polygonSeries.mapPolygons.template.events.on('pointerover', (event) => event.target.setAll({ fillOpacity: 1 }));
				polygonSeries.mapPolygons.template.events.on('pointerout', (event) => event.target.setAll({ fillOpacity: 0.7 }));
			}
		});

		// Center on a specific point
		if (center) {
			chart.set('homeGeoPoint', center);
		}

		if (type === 'glob') {
			// Restore the last known rotation
			const { rotationX, rotationY } = currentRotation.current;

			if (rotateTo) {
				chart.animate({
					key: 'rotationX',
					from: rotationX,
					to: -rotateTo.longitude,
					duration: 1000,
					easing: am5.ease.out(am5.ease.cubic),
				});
				chart.animate({
					key: 'rotationY',
					from: rotationY,
					to: -rotateTo.latitude,
					duration: 1000,
					easing: am5.ease.out(am5.ease.cubic),
				});
				// Save the new rotation
				currentRotation.current = {
					rotationX: -rotateTo.longitude,
					rotationY: -rotateTo.latitude,
				};
			} else if (animate) {
				// Resume infinite rotation
				chart.animate({
					key: 'rotationX',
					from: rotationX,
					to: 360,
					duration: 20000,
					loops: Infinity,
				});
				chart.animate({
					key: 'rotationY',
					from: rotationY,
					to: 0,
					duration: 1000,
					easing: am5.ease.out(am5.ease.cubic),
				});
			}
		}
		// });

		// Return cleanup function
		return () => {
			currentRotation.current = {
				rotationX: chart.get('rotationX') || 0,
				rotationY: chart.get('rotationY') || 0,
			};
			if (rootRef.current) {
				rootRef.current.dispose();
				rootRef.current = null;
				chartRef.current = null;
			}
		};
	}, [
		name,
		type,
		mapEntities,
		animate,
		center,
		rotateTo,
		zoom,
		enableZoom,
		enablePan,
		handleClick,
		handleHover,
		highlightedEntityCode,
		isClickable,
	]);

	return <div id={name} className="w-full h-full"></div>;
};

export default MapV2;
