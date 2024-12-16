import { getAm5Continents, getSubregions } from "@/ressources/getCountries";
import { ContinentCode, Subregion } from "@/ressources/types";
import { clsx, type ClassValue } from "clsx";
import _ from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimer(timer?: number): string {
  if (!timer) return "0:00";
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function getRegionFromURL(region?: string): string | undefined {
  return region?.split("_").join(" ");
}

export function getURLFromRegion(region?: string): string | undefined {
  return region?.split(" ").join("_").toLowerCase();
}

export const isParamMatchAnyRegionOrSubregion = (
  region?: string[],
): {
  continentCode?: ContinentCode;
  subregion?: Subregion;
} => {
  if (!region) return {};
  const continents = getAm5Continents();
  const subregions: Subregion[] = getSubregions();

  const regionOrSubregion = region.map((r) => getRegionFromURL(r));

  const continentMatch = _.find(continents, (value) =>
    _.includes(regionOrSubregion, value.name.toLowerCase()),
  );

  const subregionMatch = _.find(subregions, (value) =>
    _.includes(regionOrSubregion, value.toLowerCase()),
  );

  return {
    continentCode: continentMatch?.code,
    subregion: subregionMatch,
  };
};
