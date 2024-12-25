import React from "react";
import { GamePill } from "./GamePill";
import { Flag } from "./Flag";
import { useGameState } from "@/contexts/GameContext";

const FlagsGame = () => {
  const { gameCountries } = useGameState();

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <GamePill />
      <div className="grid sm:grid-cols-4 grid-cols-3 sm:gap-8 gap-4 px-4 sm:px-0 items-center max-w-3xl">
        {gameCountries.map((country, index) => (
          <Flag key={country.cca3} country={country} isLazy={index >= 20} />
        ))}
      </div>
    </div>
  );
};

export default FlagsGame;
