"use client";

import Glob from "@/components/Glob";
import { Button } from "@/components/ui/button";
import {
  continentCoordinates,
  getURLFromRegion,
  subregionCoordinates,
} from "@/lib/utils";
import { getAm5Continents, getSubregions } from "@/ressources/getCountries";
import Link from "next/link";
import { useState } from "react";
import continentsGeoData from "@amcharts/amcharts5-geodata/continentsRussiaEuropeLow";
import { Continent, Subregion } from "@/ressources/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const continents = getAm5Continents();
  const subregions = getSubregions();
  const [globCoordinates, setGlobCoordinates] = useState<[number, number]>();

  const handleOverLink = (region: Continent | Subregion) => {
    if (typeof region === "string") {
      const { latitude, longitude } = subregionCoordinates[region];
      setGlobCoordinates([latitude, longitude]);
    } else {
      const { latitude, longitude } = continentCoordinates[region.code];
      setGlobCoordinates([latitude, longitude]);
    }
  };

  const handleGlobClick = (event: any) => {
    const id = event.target.dataItem?.dataContext?.id;
    router.push(`game/${getURLFromRegion(id)}`);
  };

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
              <Link href={`/game/${getURLFromRegion(continent.name)}`}>
                {continent.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      {/* // ! Bloqué sur mobile mais pas sûr de pourquoi */}
      <div className="sm:flex hidden flex-col gap-6 justify-center items-center">
        <h1 className="text-2xl">...or a subregion</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          {subregions.map((subregion) => (
            <Button
              key={subregion}
              asChild
              className="hover:scale-[1.02] transition-transform duration-100 ease-in-out"
              onMouseEnter={() => handleOverLink(subregion)}
              onMouseLeave={() => setGlobCoordinates(undefined)}
            >
              <Link href={`/game/${getURLFromRegion(subregion)}`}>
                {subregion}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center min-h-[300px] flex-grow">
        <div className="w-full h-full max-h-[500px]">
          <Glob
            name="world"
            geoData={[continentsGeoData]}
            animate
            rotateTo={globCoordinates}
            handleClick={handleGlobClick}
          />
        </div>
      </div>
    </div>
  );
}
