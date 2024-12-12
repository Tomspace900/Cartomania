// ! Ça c'est deg mais on va faire ça proprement côté serveur api

import countries from "@/ressources/countries.json";
import { Country, CountryCode, Region, Subregion } from "./types";

export function getCountries(): Country[] {
  return countries as unknown as Country[];
}

export function getUNMembersCountries(): Country[] {
  return countries.filter(
    (country) => country.UNMember,
  ) as unknown as Country[];
}

export function getCountryByCode(code: CountryCode): Country {
  return countries.find(
    (country) => country.cca3 === code,
  ) as unknown as Country;
}

export function getRegions(): Region[] {
  return Array.from(
    new Set(countries.map((country) => country.region as Region)),
  ).filter(Boolean);
}

export function getSubregions(): Subregion[] {
  return Array.from(
    new Set(countries.map((country) => country.subregion as Subregion)),
  ).filter(Boolean);
}
