"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import _ from "lodash";
import Loader from "@/components/Loader";
import { Flag } from "@/components/Flag";
import { GamePrompt } from "@/components/GamePrompt";
import { useGameState } from "@/contexts/GameContext";
import { getRegions } from "@/ressources/getCountries";
import Confetti from "react-confetti";

const Game = () => {
  const regions = getRegions();
  const params = useParams<{ region?: string[] }>();

  const region = useMemo(
    () =>
      _.find(regions, (value) =>
        _.includes(
          params.region?.map((r) => r.toLowerCase()),
          value.toLowerCase(),
        ),
      ),
    [regions, params.region],
  );

  const {
    gameState,
    questionStatus,
    gameCountries,
    askedCountry,
    initGameState,
    handleClickedCountry,
  } = useGameState();

  useEffect(() => {
    initGameState(region, true);
  }, [region]);

  switch (gameState) {
    case "loading":
      return <Loader />;

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
          <div className="flex justify-center items-center mt-10 text-2xl">
            {`Bravo t'es un(e) chef`}
          </div>
        </>
      );

    case "playing":
      return (
        <div className="flex flex-col w-full items-center gap-4">
          {askedCountry && (
            <GamePrompt
              country={askedCountry}
              questionStatus={questionStatus}
            />
          )}

          <div className="flex flex-wrap gap-8 justify-center items-center max-w-3xl">
            {gameCountries.map((country, index) => (
              <Flag
                key={country.cca2}
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
