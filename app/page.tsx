"use client";

import { Input } from "@/components/ui/input";
// import countries from "@/ressources/countries.json";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_FLAGCDN_BASE_URL;

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 2) setSelectedCountry(value);
  };

  return (
    <>
      <Input
        type="text"
        value={selectedCountry}
        onChange={handleCountryChange}
        maxLength={2}
        placeholder="Enter country code (2 letters)"
        className="border p-2 rounded"
      />

      {selectedCountry.length === 2 && (
        <Image
          src={`${API_URL}/${selectedCountry.toLowerCase()}.svg`}
          alt={`${selectedCountry}_flag`}
          width={120}
          height={90}
          className="rounded-md"
        />
      )}
    </>
  );
}
