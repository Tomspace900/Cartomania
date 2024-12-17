"use client";

import Image from "next/image";
import { GameCountry, QuestionStatus } from "@/contexts/GameContext";
import { useState } from "react";

interface FlagProps {
  country: GameCountry;
  onClick: (country: GameCountry) => QuestionStatus;
  isLazy?: boolean;
  disabled?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_FLAGCDN_BASE_URL;

export const Flag = ({ country, onClick, isLazy, disabled }: FlagProps) => {
  const [status, setStatus] = useState<QuestionStatus>("idle");

  const isDisabled = disabled || (status !== "incorrect" && country.disabled);

  const src = `${API_URL}/w320/${country.cca2.toLowerCase()}.webp`;

  const handleClick = () => {
    if (isDisabled) return;
    const result = onClick(country);
    setStatus(result);
    setTimeout(() => setStatus("idle"), 500);
  };

  return (
    <div
      className={`rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out ${
        isDisabled
          ? "pointer-events-none opacity-40"
          : status === "incorrect"
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
