"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useRouter } from "next/navigation";
import { getURLFromRegion } from "@/lib/utils";

interface IGlobProps {
  name: string;
  // eslint-disable-next-line no-undef
  geoData: GeoJSON.GeoJSON[];
  animate?: boolean;
  rotateTo?: [number, number];
}

const isMobile = window.innerWidth < 640;

const Glob = ({ name, geoData, animate, rotateTo }: IGlobProps) => {
  const router = useRouter();
  const currentRotation = useRef({ rotationX: 0, rotationY: 0 });

  const handleClick = (target: string) =>
    router.push(`game/${getURLFromRegion(target)}`);

  useLayoutEffect(() => {
    const root = am5.Root.new(name);
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: isMobile ? "rotateX" : "none",
        panY: isMobile ? "rotateY" : "none",
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
      // Add click event
      polygonSeries.mapPolygons.template.events.on(
        "click",
        (event) => {
          const polygon = event.target;
          // @ts-expect-error normal TS error
          handleClick(polygon.dataItem?.dataContext?.id as string);
        },
        { priority: 1 },
      );
    });

    // Restore the last known rotation
    const { rotationX, rotationY } = currentRotation.current;

    if (rotateTo) {
      const [latitude, longitude] = rotateTo;

      chart.animate({
        key: "rotationX",
        from: rotationX,
        to: -longitude,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic),
      });
      chart.animate({
        key: "rotationY",
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
        key: "rotationX",
        from: rotationX,
        to: 360,
        duration: 20000,
        loops: Infinity,
      });
      chart.animate({
        key: "rotationY",
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
        rotationX: chart.get("rotationX") || 0,
        rotationY: chart.get("rotationY") || 0,
      };
      root.dispose();
    };
  }, [rotateTo]);

  return <div id={name} className="w-full h-full"></div>;
};

export default Glob;
