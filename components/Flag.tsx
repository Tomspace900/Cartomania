"use client";

import Image from "next/image";
import { Country } from "@/ressources/types";
import { QuestionStatus } from "@/contexts/GameContext";
import { useState } from "react";

interface FlagProps {
  country: Country;
  onClick: (country: Country) => QuestionStatus;
  isLazy?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_FLAGCDN_BASE_URL;

export const Flag = ({ country, onClick, isLazy }: FlagProps) => {
  const [status, setStatus] = useState<QuestionStatus>("idle");

  const handleClick = () => {
    const result = onClick(country);
    setStatus(result);
    setTimeout(() => setStatus("idle"), 500);
  };

  const src = `${API_URL}/w320/${country.cca2.toLowerCase()}.webp`;

  return (
    <div
      className={`rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ${
        status === "incorrect"
          ? "error-shake error-red"
          : status === "correct"
            ? "success-bounce success-green"
            : ""
      }`}
    >
      <Image
        onClick={handleClick}
        src={src}
        alt={`${country.cca3}_flag`}
        width={130}
        height={90}
        className="rounded-md shadow-md h-auto"
        loading={isLazy ? "lazy" : "eager"}
      />
    </div>
  );
};
