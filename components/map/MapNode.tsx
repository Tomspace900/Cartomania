import React, { useCallback } from 'react';
import { geoPath, GeoProjection } from 'd3-geo';
import type { Feature } from 'geojson';

interface MapNodeProps {
	feature: Feature;
	projection: GeoProjection;
	onHover: (feature: Feature | null) => void;
	onClick?: (feature: Feature) => void;
	style?: React.CSSProperties;
}

const MapNode = ({ feature, projection, onHover, onClick, style }: MapNodeProps) => {
	const path = geoPath().projection(projection);

	const handleMouseEnter = useCallback(() => {
		onHover?.(feature);
	}, [feature, onHover]);

	const handleMouseLeave = useCallback(() => {
		onHover?.(null);
	}, [onHover]);

	const handleClick = useCallback(() => {
		onClick?.(feature);
	}, [feature, onClick]);

	const baseStyle: React.CSSProperties = {
		transition: 'all 0.3s ease',
		cursor: onClick ? 'pointer' : 'default',
	};

	return (
		<path
			d={path(feature.geometry) || ''}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
			style={{
				...baseStyle,
				...style,
			}}
		/>
	);
};

export default MapNode;
