export interface Country {
  name: {
    common: string;
    official: string;
    native: {
      common: string;
      official: string;
    };
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: CountryCode;
  currency: string[];
  callingCode: string[];
  capital: string;
  altSpellings: string[];
  relevance: string;
  region: Region;
  subregion: Subregion;
  nativeLanguage: LanguageCode;
  languages: Record<LanguageCode, string>;
  translations: Record<LanguageCode, string>;
  latlng: [number, number];
  demonym: string;
  borders: CountryCode[];
  area: number;
  UNMember: boolean;
  am5: {
    name: string;
    continent: string;
    continentCode: ContinentCode;
    maps: string[];
  };
}

export type ContinentCode = "AF" | "NA" | "SA" | "AS" | "EU" | "OC" | "AN";

export type CountryCode = string;
export type LanguageCode = string;

export type Region = "Africa" | "Americas" | "Asia" | "Europe" | "Oceania" | "";

export type Subregion =
  | "Northern Africa"
  | "Middle Africa"
  | "Western Africa"
  | "Southern Africa"
  | "Eastern Africa"
  | "Northern America"
  | "Central America"
  | "Caribbean"
  | "South America"
  | "Central Asia"
  | "Eastern Asia"
  | "Southern Asia"
  | "South-Eastern Asia"
  | "Western Asia"
  | "Eastern Europe"
  | "Northern Europe"
  | "Southern Europe"
  | "Western Europe"
  | "Australia and New Zealand"
  | "Melanesia"
  | "Micronesia"
  | "Polynesia"
  | "";
