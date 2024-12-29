'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface IMapProps {
	type: 'map' | 'glob';
	name: string;
	// eslint-disable-next-line no-undef
	geoData: GeoJSON.GeoJSON[];
	animate?: boolean;
	center?: { longitude: number; latitude: number };
	rotateTo?: { longitude: number; latitude: number };
	zoom?: number;
	enableZoom?: boolean;
	enablePan?: boolean;
	handleClick?: (event: any) => void;
	handleHover?: (event: any) => void;
	highlightedPolygonId?: string;
}

const Map = ({
	type,
	name,
	geoData,
	animate,
	center,
	rotateTo,
	zoom = 1,
	enableZoom = false,
	enablePan = false,
	handleClick,
	handleHover,
	highlightedPolygonId,
}: IMapProps) => {
	const chartRef = useRef<am5map.MapChart | null>(null);
	const currentRotation = useRef({ rotationX: 0, rotationY: 0 });
	const isClickable = !!handleClick;

	const isHighlighted = (polygon: am5map.MapPolygon): boolean =>
		// @ts-expect-error normal
		highlightedPolygonId === polygon.dataItem?.dataContext?.id;

	useLayoutEffect(() => {
		const root = am5.Root.new(name);
		root.setThemes([am5themes_Animated.new(root)]);

		// Create the map chart
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

		// Configuration du zoom
		chart.set('zoomLevel', zoom);
		chart.set('maxZoomLevel', 32);
		chart.set('minZoomLevel', 1);

		// Background fill
		const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
		backgroundSeries.mapPolygons.template.setAll({
			fill: am5.color('#8066d6'),
			fillOpacity: 0.1,
			strokeOpacity: 0,
		});
		backgroundSeries.data.push({
			geometry: type === 'glob' ? am5map.getGeoRectangle(90, 180, -90, -180) : null,
		});

		// Background grid
		const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
		graticuleSeries.mapLines.template.setAll({
			stroke: am5.color('#8066d6'),
			strokeOpacity: 0.08,
		});

		// Data series
		geoData.forEach((geo) => {
			// Create main polygon series
			const polygonSeries = chart.series.push(
				am5map.MapPolygonSeries.new(root, {
					geoJSON: geo,
				})
			);
			// Configure polygon series
			polygonSeries.mapPolygons.template.setAll({
				fill: am5.color('#8066d6'),
				fillOpacity: highlightedPolygonId ? 0.5 : 0.7,
				// strokeOpacity: 0,
				strokeWidth: 0.25,
				stroke: am5.color('#ffffff'),
				cursorOverStyle: isClickable ? 'pointer' : 'default',
			});
			// Highlight selected countries
			polygonSeries.events.on('datavalidated', () => {
				polygonSeries.mapPolygons.each((polygon) => {
					if (isHighlighted(polygon)) {
						polygon.setAll({
							fillOpacity: 1,
						});
					}
				});
			});

			// Add hover effects
			if (handleHover) {
				polygonSeries.mapPolygons.template.events.on('pointerover', (event) => handleHover(event));
				polygonSeries.mapPolygons.template.events.on('pointerout', (event) => handleHover(event));
			}

			// Add click event
			if (isClickable) {
				polygonSeries.mapPolygons.template.events.on('click', (event) => handleClick(event), { priority: 1 });
				polygonSeries.mapPolygons.template.events.on('pointerover', (event) => event.target.setAll({ fillOpacity: 1 }));
				polygonSeries.mapPolygons.template.events.on('pointerout', (event) => event.target.setAll({ fillOpacity: 0.7 }));
			}
		});

		// Centrer sur une zone spécifique si demandé
		if (center) {
			chart.set('homeGeoPoint', {
				longitude: center.longitude,
				latitude: center.latitude,
			});
		}

		// Restore the last known rotation
		const { rotationX, rotationY } = currentRotation.current;

		if (rotateTo) {
			const { longitude, latitude } = rotateTo;

			chart.animate({
				key: 'rotationX',
				from: rotationX,
				to: -longitude,
				duration: 1000,
				easing: am5.ease.out(am5.ease.cubic),
			});
			chart.animate({
				key: 'rotationY',
				from: rotationY,
				to: -latitude,
				duration: 1000,
				easing: am5.ease.out(am5.ease.cubic),
			});
			// Save the new rotation
			currentRotation.current = {
				rotationX: -longitude,
				rotationY: -latitude,
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

		// Clean up on unmount
		return () => {
			// Save the current rotation before unmounting
			currentRotation.current = {
				rotationX: chart.get('rotationX') || 0,
				rotationY: chart.get('rotationY') || 0,
			};
			root.dispose();
		};
	}, [rotateTo, center, zoom]);

	// Méthode pour centrer la carte sur des coordonnées spécifiques
	const centerOn = (longitude: number, latitude: number) => {
		if (chartRef.current) {
			chartRef.current.set('homeGeoPoint', {
				longitude,
				latitude,
			});
		}
	};

	// Méthode pour définir le niveau de zoom
	const setZoomLevel = (level: number) => {
		if (chartRef.current) {
			chartRef.current.set('zoomLevel', level);
		}
	};

	return <div id={name} className="w-full h-full"></div>;
};

export default Map;
