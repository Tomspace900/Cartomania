"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { Flag } from "@/components/Flag";
import { GamePill } from "@/components/GamePill";
import { useGameState } from "@/contexts/GameContext";
import Confetti from "react-confetti";
import { formatTimer, isParamMatchAnyRegionOrSubregion } from "@/lib/utils";
import { Timer } from "lucide-react";

const Game = () => {
  const params = useParams<{ region?: string[] }>();

  const {
    gameState,
    questionStatus,
    gameCountries,
    timer,
    askedCountry,
    initGameState,
    handleClickedCountry,
  } = useGameState();

  useEffect(() => {
    const { continentCode, subregion } = isParamMatchAnyRegionOrSubregion(
      params.region,
    );
    initGameState(continentCode, subregion, false);
  }, [params]);

  switch (gameState) {
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
        <>
          <Confetti
            height={document.documentElement.scrollHeight}
            width={window.innerWidth}
            recycle={false}
            numberOfPieces={400}
            gravity={0.1}
          />
          <div className="flex flex-col justify-center items-center mt-10 text-2xl gap-4">
            <div>{`Bravo t'es un(e) chef`}</div>
            {timer && (
              <div className="flex items-center gap-2">
                <Timer className="h-8 w-8" />
                {formatTimer(timer)}
              </div>
            )}
          </div>
        </>
      );

    case "playing":
      return (
        <div className="flex flex-col w-full items-center gap-4">
          {askedCountry && (
            <GamePill
              country={askedCountry}
              questionStatus={questionStatus}
              timer={timer}
            />
          )}

          <div className="flex flex-wrap gap-8 justify-center items-center max-w-3xl">
            {gameCountries.map((country, index) => (
              <Flag
                key={country.cca3}
                country={country}
                onClick={handleClickedCountry}
                isLazy={index >= 20}
              />
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default Game;
