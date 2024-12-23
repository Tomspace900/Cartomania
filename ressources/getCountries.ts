// ! Ça c'est deg mais on va faire ça proprement côté serveur api

import { continents } from "./continents";
import { countries } from "./countries";
import { Continent, ContinentCode, Country, CountryCode } from "./types";
import _ from "lodash";

export function getCountries(): Country[] {
  return countries;
}

export function getUNMembersCountries(): Country[] {
  return countries.filter((country) => country.UNMember);
}

export function getCountryByCode(code: CountryCode): Country | undefined {
  return countries.find((country) => country.cca3 === code);
}

export function getContinents(): Continent[] {
  return continents;
}

export const getContinentByCode = (code?: ContinentCode) => {
  if (!code) return undefined;
  return getContinents().find((continent) => continent.code === code);
};

// export function getSubregions(): Subregion[] {
//   return Array.from(
//     new Set(countries.map((country) => country.subregion)),
//   ).filter(Boolean);
// }
