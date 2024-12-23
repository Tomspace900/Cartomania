"use client";

import Glob from "@/components/Glob";
import { Button } from "@/components/ui/button";
import { continentCoordinates, getURLFromRegion } from "@/lib/utils";
import { getContinents } from "@/ressources/getCountries";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Continent } from "@/ressources/types";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/lib/types";
import { loadGeodata } from "@/ressources/loadGeoData";

const isMobile = window.innerWidth < 640;

export default function Home() {
  const router = useRouter();
  const continents = getContinents();
  const [loading, setLoading] = useState<LoadingState>("idle");
  // eslint-disable-next-line no-undef
  const [continentsGeoData, setContinentsGeoData] = useState<GeoJSON.GeoJSON>();
  const [globCoordinates, setGlobCoordinates] = useState<[number, number]>();

  const handleOverLink = (continent: Continent) => {
    const { latitude, longitude } = continentCoordinates[continent.code];
    setGlobCoordinates([latitude, longitude]);
  };

  const handleGlobClick = (event: any) => {
    const id = event.target.dataItem?.dataContext?.id;
    router.push(`game/flags/${getURLFromRegion(id)}`);
  };

  const handleGlobHover = useCallback((event: any) => {
    const type = event.type;
    if (type === "pointerover") event.target.setAll({ fillOpacity: 1 });
    else event.target.setAll({ fillOpacity: 0.7 });
  }, []);

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading("loading");

      try {
        await loadGeodata(["continents"], (data) => setContinentsGeoData(data));
        setLoading("done");
      } catch (error) {
        console.error(error);
        setLoading("failed");
      }
    };

    fetchGeoData();
  }, []);

  return (
    <div className="sm:px-12 px-6 max-w-5xl flex flex-col w-full h-full gap-10">
      <div className="flex flex-col gap-6 justify-center items-center">
        <h1 className="text-2xl">Select a continent...</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          {continents.map((continent) => (
            <Button
              key={continent.name}
              asChild
              className="hover:scale-[1.02] transition-transform duration-100 ease-in-out"
              onMouseEnter={() => handleOverLink(continent)}
              onMouseLeave={() => setGlobCoordinates(undefined)}
            >
              <Link href={`/game/flags/${getURLFromRegion(continent.name)}`}>
                {continent.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center min-h-[300px] flex-grow">
        {loading === "done" && continentsGeoData && (
          <div className="w-full h-full max-h-[500px]">
            <Glob
              name="world"
              geoData={[continentsGeoData]}
              animate
              enableManipulate={isMobile}
              rotateTo={globCoordinates}
              handleClick={handleGlobClick}
              handleHover={handleGlobHover}
            />
          </div>
        )}
      </div>
    </div>
  );
}
