"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { Flag } from "@/components/Flag";
import { GamePill } from "@/components/GamePill";
import { GameParams, useGameState } from "@/contexts/GameContext";
import { isParamMatchAnyContinent } from "@/lib/utils";
import WinScreen from "@/components/WinScreen";

const Game = () => {
  const params = useParams<{ region?: string[] }>();
  const continentCode = isParamMatchAnyContinent(params.region);
  const { gameState, gameCountries, initGame } = useGameState();

  const gameParams: GameParams = {
    continentCode,
    UNMembersOnly: true,
  };

  useEffect(() => {
    initGame(gameParams);
  }, [params]);

  switch (gameState) {
    case "error":
    case "loading":
      return <Loader />;

    // Pas encore de cas de défaite
    case "lose":
      return (
        <div className="flex justify-center items-center mt-10 text-2xl">
          Perdu mon chef
        </div>
      );

    case "win":
      return (
        <WinScreen continentCode={continentCode} gameParams={gameParams} />
      );

    case "loaded":
    case "playing":
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

    default:
      return null;
  }
};

export default Game;
