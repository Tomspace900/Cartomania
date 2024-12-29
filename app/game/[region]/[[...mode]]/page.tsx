"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { GameParams, useGameState } from "@/contexts/GameContext";
import { isParamMatchAnyContinent } from "@/lib/utils";
import WinScreen from "@/components/WinScreen";
import FlagsGame from "@/components/FlagsGame";
import DefaultGame from "@/components/DefaultGame";

enum GameMode {
  FLAGS = "flags",
  CAPITALS = "capitals",
  DEFAULT = "default",
}

const Game = () => {
  const params = useParams<{ region: string; mode?: string[] }>();
  const router = useRouter();
  const [validMode, setValidMode] = useState(false);

  const clearUrl = (mode?: string) =>
    router.push(`/game/${params.region}/${mode || "default"}`);

  useEffect(() => {
    if (!params.mode) clearUrl();
    else if (!Object.values(GameMode).includes(params.mode[0] as GameMode))
      clearUrl();
    else if (params.mode.length > 1) clearUrl(params.mode[0]);
    else setValidMode(true);
  }, [params, router]);

  const continentCode = isParamMatchAnyContinent(params.region);
  const { gameState, initGame } = useGameState();

  const gameParams: GameParams = {
    continentCode,
    UNMembersOnly: true,
  };

  useEffect(() => {
    if (validMode) initGame(gameParams);
  }, [validMode]);

  if (!validMode) return <Loader />;

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
      return params.mode && params.mode[0] === "flags" ? (
        <FlagsGame />
      ) : (
        <DefaultGame />
      );

    default:
      return null;
  }
};

export default Game;