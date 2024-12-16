"use client";

import Glob from "@/components/Glob";
import { Button } from "@/components/ui/button";
import { getURLFromRegion } from "@/lib/utils";
import { getRegions, getSubregions } from "@/ressources/getCountries";
import Link from "next/link";
import world from "@amcharts/amcharts5-geodata/worldOutlineLow";
// import continents from "@amcharts/amcharts5-geodata/continentsRussiaEuropeLow";
// import countries from "@amcharts/amcharts5-geodata/worldLow";

export default function Home() {
  const regions = getRegions();
  const subregions = getSubregions();

  return (
    <div className="sm:px-12 px-6 max-w-5xl flex flex-col w-full h-full gap-10">
      <div className="flex flex-col gap-6 justify-center items-center">
        <h1 className="text-2xl">Choose a region...</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          {regions.map((region) => (
            <Button
              key={region}
              asChild
              className="hover:scale-[1.02] transition-transform duration-100 ease-in-out"
            >
              <Link href={`/game/${getURLFromRegion(region)}`}>{region}</Link>
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
          <Glob name="world" geoData={world} />
        </div>
      </div>
      {/* <div className="flex items-center min-h-[300px] flex-grow">
        <div className="w-full h-full max-h-[500px]">
          <Glob name="continents" geoData={continents} />
        </div>
      </div>
      <div className="flex items-center min-h-[300px] flex-grow">
        <div className="w-full h-full max-h-[500px]">
          <Glob name="countries" geoData={countries} />
        </div>
      </div> */}
    </div>
  );
}
