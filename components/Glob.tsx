import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface IGlobProps {
  name: string;
  // eslint-disable-next-line no-undef
  geoData: GeoJSON.GeoJSON[];
  animate?: boolean;
}

const Glob = ({ name, geoData, animate }: IGlobProps) => {
  useLayoutEffect(() => {
    const root = am5.Root.new(name);
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        homeGeoPoint: { longitude: 2.33, latitude: 48.87 }, // Paris
        wheelX: "none",
        wheelY: "none",
      }),
    );

    // Background fill
    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {}),
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color("#8066d6"),
      fillOpacity: 0.1,
      strokeOpacity: 0,
    });

    // Background grid
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });
    const graticuleSeries = chart.series.push(
      am5map.GraticuleSeries.new(root, {}),
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color("#8066d6"),
      strokeOpacity: 0.08,
    });

    // Data series
    geoData.forEach((geo) => {
      // Create main polygon series
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: geo,
        }),
      );
      // Configure polygon series
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color("#8066d6"),
        fillOpacity: 0.7,
        // strokeOpacity: 0,
        strokeWidth: 0.25,
        stroke: am5.color("#ffffff"),
        cursorOverStyle: "pointer",
      });
      // Add hover effects
      polygonSeries.mapPolygons.template.events.on("pointerover", (event) =>
        event.target.setAll({ fillOpacity: 1 }),
      );
      polygonSeries.mapPolygons.template.events.on("pointerout", (event) =>
        event.target.setAll({ fillOpacity: 0.7 }),
      );
    });

    // Rotate the globe
    animate &&
      chart.animate({
        key: "rotationX",
        from: 0,
        to: 360,
        duration: 20000,
        loops: Infinity,
      });

    // Clean up on unmount
    return () => {
      root.dispose();
    };
  });

  return <div id={name} className="w-full h-full"></div>;
};

export default Glob;
