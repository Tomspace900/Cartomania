// ! Ça c'est deg mais on va faire ça proprement côté serveur api

import countries from "@/ressources/countries.json";
import {
  ContinentCode,
  Country,
  CountryCode,
  Region,
  Subregion,
} from "./types";
import _ from "lodash";

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

export function getAm5Continents(): { name: string; code: ContinentCode }[] {
  return Array.from(
    _.uniqBy(
      countries.map(
        (country) =>
          ({
            name: country.am5.continent,
            code: country.am5.continentCode,
          }) as { name: string; code: ContinentCode },
      ),
      "code",
    ),
  );
}

export const getAm5ContinentByCode = (code: ContinentCode) => {
  return getAm5Continents().find((continent) => continent.code === code);
};

export const getAm5ContinentByName = (name: string) => {
  return getAm5Continents().find((continent) => continent.name === name);
};

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
