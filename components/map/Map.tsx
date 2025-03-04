import React, { useState, useMemo, useRef, useEffect } from 'react';
import { geoMercator, geoOrthographic, GeoProjection } from 'd3-geo';
import type { Feature, FeatureCollection } from 'geojson';
import MapNode from './MapNode';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type MapType = 'map' | 'glob';

export type MapEntityType = 'country' | 'continent';

export interface MapEntity<T> {
	type: MapEntityType;
	code: string;
	disabled?: boolean;
	entity: T;
	geoData: FeatureCollection | null;
}

export interface IMapProps<T> {
	type: MapType;
	mapEntities: MapEntity<T>[];
	disableZoom?: boolean;
	onRegionClick?: (entity: T) => void;
	onRegionHover?: (entity: T | null) => void;
	getRegionStyle?: <T>(entity: T, isHovered: boolean, isDisabled?: boolean) => React.CSSProperties;
}

const Map = <T,>({ type, mapEntities, disableZoom, onRegionClick, onRegionHover, getRegionStyle }: IMapProps<T>) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null);
	const [viewport, setViewport] = useState({ zoom: 1, x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const handleHoverRegion =
		({ entity }: MapEntity<T>) =>
		(feature: Feature | null) => {
			setHoveredFeature(feature);
			if (onRegionHover) onRegionHover(feature ? entity : null);
		};

	const handleRegionClick =
		({ entity }: MapEntity<T>) =>
		(feature: Feature | null) => {
			if (onRegionClick) onRegionClick(entity);
		};

	useEffect(() => {
		if (!containerRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			setDimensions({ width, height });
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		if (disableZoom || !containerRef.current) return;

		const svgElement = containerRef.current.querySelector('svg');
		if (!svgElement) return;

		const handleWheelListener = (e: WheelEvent) => {
			e.preventDefault();
			const delta = -e.deltaY;
			const factor = 0.01;
			const newZoom = Math.max(1, Math.min(5, viewport.zoom + delta * factor));

			// Pas possible de dézoomer en dessous de 1
			if (newZoom === 1 && delta < 0) {
				setViewport({ zoom: 1, x: 0, y: 0 });
				return;
			}

			const rect = svgElement.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const zoomDiff = newZoom - viewport.zoom;
			const newX = viewport.x - ((x - dimensions.width / 3) * zoomDiff) / viewport.zoom;
			const newY = viewport.y - ((y - dimensions.height / 3) * zoomDiff) / viewport.zoom;

			setViewport({ zoom: newZoom, x: newX, y: newY });
		};

		svgElement.addEventListener('wheel', handleWheelListener, { passive: false });

		return () => {
			svgElement.removeEventListener('wheel', handleWheelListener);
		};
	}, [viewport, dimensions, containerRef]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (disableZoom || viewport.zoom === 1) return; // Ne pas permettre le drag si zoom = 1
		setIsDragging(true);
		setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (disableZoom || !isDragging) return;

		const limit = 100 * viewport.zoom; // Limite à 100px dans chaque direction
		const newX = e.clientX - dragStart.x;
		const newY = e.clientY - dragStart.y;

		setViewport((prev) => ({
			...prev,
			x: Math.max(-limit, Math.min(limit, newX)),
			y: Math.max(-limit, Math.min(limit, newY)),
		}));
	};

	const leaveDragging = () => {
		setIsDragging(false);
	};

	const allFeatures: FeatureCollection = useMemo(
		() => ({
			type: 'FeatureCollection',
			features: mapEntities.flatMap((mapEntity) => mapEntity.geoData?.features).filter((e) => e !== undefined),
		}),
		[mapEntities]
	);

	const projection: GeoProjection | null = useMemo(() => {
		if (dimensions.width === 0 || dimensions.height === 0) return null;
		return (type === 'map' ? geoMercator() : geoOrthographic()).fitSize([dimensions.width, dimensions.height], allFeatures);
	}, [allFeatures, dimensions]);

	const ZoomIndicator = () =>
		!disableZoom && (
			<div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
				<Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" disabled={viewport.zoom === 1}>
					<Search className="h-4 w-4 mr-2" />
					{Math.round(viewport.zoom * 100)}%
				</Button>
			</div>
		);

	const getDefaultStyle = (isHovered: boolean, isDisabled?: boolean): React.CSSProperties => ({
		fill: isDisabled ? '#cccccc' : '#8066d6',
		stroke: '#ffffff',
		strokeWidth: 0.25,
		fillOpacity: isHovered ? 1 : 0.7,
	});

	return (
		<div ref={containerRef} className="relative w-full h-full overflow-hidden">
			{projection && (
				<>
					<svg
						width={dimensions.width}
						height={dimensions.height}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={leaveDragging}
						onMouseLeave={leaveDragging}
						style={{
							cursor: isDragging ? 'grabbing' : viewport.zoom > 1 ? 'grab' : 'default',
						}}
					>
						<g
							style={{
								transform: `scale(${viewport.zoom}) translate(${viewport.x}px, ${viewport.y}px)`,
								transformOrigin: 'center',
								userSelect: 'none',
								overscrollBehavior: 'none',
							}}
						>
							{mapEntities.map((mapEntity) => {
								const { code, geoData } = mapEntity;
								if (!geoData) return;
								return (
									<g key={`collection-${code}`}>
										{geoData.features.map((feature, index) => {
											const isDisabled = mapEntity.disabled;
											const isHovered = hoveredFeature === feature;
											return (
												<MapNode
													key={`feature-${code}-${index}`}
													feature={feature}
													projection={projection}
													onHover={handleHoverRegion(mapEntity)}
													onClick={onRegionClick && handleRegionClick(mapEntity)}
													style={{
														...getDefaultStyle(isHovered, isDisabled),
														...getRegionStyle?.(mapEntity, isHovered, isDisabled),
													}}
												/>
											);
										})}
									</g>
								);
							})}
						</g>
					</svg>
					<ZoomIndicator />
				</>
			)}
		</div>
	);
};

export default Map;
