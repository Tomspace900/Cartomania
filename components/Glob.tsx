import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface IGlobProps {
  name: string;
  geoData: any;
}

const Glob = ({ name, geoData }: IGlobProps) => {
  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new(name);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "none",
        panY: "none",
        projection: am5map.geoOrthographic(),
        homeGeoPoint: { longitude: 2.33, latitude: 48.87 }, // Paris
        wheelX: "none",
        wheelY: "none",
      }),
    );

    // Create series for background fill
    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {}),
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color("#8066d6"),
      fillOpacity: 0.1,
      strokeOpacity: 0,
    });

    // Add background polygon
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    // Create main polygon series for countries
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geoData,
        exclude: ["AQ"],
      }),
    );

    // Set up the series
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color("#8066d6"),
      fillOpacity: 0.7,
      strokeOpacity: 0,
      // strokeWidth: 0.25,
      // stroke: am5.color("#ffffff"),
    });

    // Create graticule series
    const graticuleSeries = chart.series.push(
      am5map.GraticuleSeries.new(root, {}),
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color("#8066d6"),
      strokeOpacity: 0.08,
    });

    // Rotate the globe
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
