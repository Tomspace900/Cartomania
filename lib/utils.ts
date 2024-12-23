import { getContinents } from "@/ressources/getCountries";
import { ContinentCode } from "@/ressources/types";
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
  return region
    ?.replace(/(?<=[a-zA-Z0-9])([A-Z])/g, "_$1")
    .split(" ")
    .join("_")
    .toLowerCase();
}

export const isParamMatchAnyContinent = (
  params?: string[],
): ContinentCode | undefined => {
  if (!params) return undefined;
  const continents = getContinents();

  const continent = params.map((r) => getRegionFromURL(r));

  const continentMatch = _.find(continents, (value) =>
    _.includes(continent, value.name.toLowerCase()),
  );

  return continentMatch?.code;
};

type ContinentCoordinates = {
  [key in ContinentCode]: { latitude: number; longitude: number };
};

export const continentCoordinates: ContinentCoordinates = {
  AF: { latitude: 7.5, longitude: 20.0 }, // Afrique
  NA: { latitude: 40.0, longitude: -100.0 }, // Amérique du Nord
  SA: { latitude: -15.0, longitude: -60.0 }, // Amérique du Sud
  AS: { latitude: 31.0, longitude: 90.0 }, // Asie
  EU: { latitude: 54.0, longitude: 25.0 }, // Europe
  OC: { latitude: -25.0, longitude: 135.0 }, // Océanie
  AN: { latitude: -85.0, longitude: 0.0 }, // Antarctique
};

// type SubregionCoordinates = {
//   [key in Subregion]: { latitude: number; longitude: number };
// };

// export const subregionCoordinates: SubregionCoordinates = {
//   "Northern Africa": { latitude: 20.0, longitude: 10.0 }, // Afrique du Nord
//   "Middle Africa": { latitude: 0.0, longitude: 20.0 }, // Afrique centrale
//   "Western Africa": { latitude: 10.0, longitude: -5.0 }, // Afrique de l'Ouest
//   "Southern Africa": { latitude: -22.0, longitude: 25.0 }, // Afrique australe
//   "Eastern Africa": { latitude: 0.0, longitude: 35.0 }, // Afrique de l'Est
//   "Northern America": { latitude: 45.0, longitude: -100.0 }, // Amérique du Nord
//   "Central America": { latitude: 15.0, longitude: -85.0 }, // Amérique centrale
//   Caribbean: { latitude: 18.0, longitude: -75.0 }, // Caraïbes
//   "South America": { latitude: -15.0, longitude: -60.0 }, // Amérique du Sud
//   "Central Asia": { latitude: 45.0, longitude: 65.0 }, // Asie centrale
//   "Eastern Asia": { latitude: 35.0, longitude: 105.0 }, // Asie de l'Est
//   "Southern Asia": { latitude: 20.0, longitude: 80.0 }, // Asie du Sud
//   "South-Eastern Asia": { latitude: 5.0, longitude: 115.0 }, // Asie du Sud-Est
//   "Western Asia": { latitude: 30.0, longitude: 50.0 }, // Asie occidentale
//   "Eastern Europe": { latitude: 55.0, longitude: 30.0 }, // Europe de l'Est
//   "Northern Europe": { latitude: 60.0, longitude: 15.0 }, // Europe du Nord
//   "Southern Europe": { latitude: 40.0, longitude: 15.0 }, // Europe du Sud
//   "Western Europe": { latitude: 50.0, longitude: 5.0 }, // Europe de l'Ouest
//   "Australia and New Zealand": { latitude: -25.0, longitude: 135.0 }, // Australie et Nouvelle-Zélande
//   Melanesia: { latitude: -10.0, longitude: 160.0 }, // Mélanésie
//   Micronesia: { latitude: 7.0, longitude: 158.0 }, // Micronésie
//   Polynesia: { latitude: -15.0, longitude: -140.0 }, // Polynésie
//   Antarctica: { latitude: -85.0, longitude: 0.0 }, // Antarctique
// };
