"use client";

import { Button } from "@/components/ui/button";
import { getURLFromRegion } from "@/lib/utils";
import { getRegions, getSubregions } from "@/ressources/getCountries";
import Link from "next/link";

export default function Home() {
  const regions = getRegions();
  const subregions = getSubregions();

  return (
    <div className="sm:px-12 px-6 max-w-5xl flex flex-col w-full items-center gap-10">
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
  );
}
