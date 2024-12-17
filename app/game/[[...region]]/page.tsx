"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { Flag } from "@/components/Flag";
import { GamePill } from "@/components/GamePill";
import { useGameState } from "@/contexts/GameContext";
import Confetti from "react-confetti";
import {
  continentCoordinates,
  formatTimer,
  getURLFromRegion,
  isParamMatchAnyRegionOrSubregion,
  subregionCoordinates,
} from "@/lib/utils";
import { Timer } from "lucide-react";
import Glob from "@/components/Glob";
import continentsGeoData from "@amcharts/amcharts5-geodata/continentsRussiaEuropeLow";
import { getAm5ContinentByCode } from "@/ressources/getCountries";
import { Button } from "@/components/ui/button";

const Game = () => {
  const params = useParams<{ region?: string[] }>();
  const { continentCode, subregion } = isParamMatchAnyRegionOrSubregion(
    params.region,
  );
  const { gameState, gameCountries, timer, initGame, handleClickedCountry } =
    useGameState();

  const gameParams = { continentCode, subregion, UNMembersOnly: true };

  useEffect(() => {
    initGame(gameParams);
  }, [params]);

  const computeRotateTo = (): [number, number] => {
    const { latitude, longitude } = continentCode
      ? continentCoordinates[continentCode]
      : subregion
        ? subregionCoordinates[subregion]
        : { latitude: 0, longitude: 0 };
    return [latitude, longitude];
  };

  const polygonToHighlight: string | undefined =
    continentCode &&
    getURLFromRegion(getAm5ContinentByCode(continentCode)?.name);

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
        <>
          <Confetti
            height={document.documentElement.scrollHeight}
            width={window.innerWidth}
            recycle={false}
            numberOfPieces={400}
            gravity={0.1}
          />
          <div className="flex flex-col h-full justify-center items-center mt-10 text-2xl gap-4">
            <div>{`Bravo t'es un(e) chef`}</div>
            {timer && (
              <div className="flex items-center gap-2">
                <Timer className="h-8 w-8" />
                {formatTimer(timer)}
              </div>
            )}
            <Button onClick={() => initGame(gameParams)}>Rejouer</Button>
            <div className="w-[400px] min-h-[300px] flex-grow">
              <Glob
                name="oui"
                geoData={[continentsGeoData]}
                rotateTo={computeRotateTo()}
                highlightedPolygons={polygonToHighlight}
              />
            </div>
          </div>
        </>
      );

    case "loaded":
    case "playing":
      return (
        <div className="flex flex-col w-full items-center gap-4">
          <GamePill />
          <div className="flex flex-wrap gap-8 justify-center items-center max-w-3xl">
            {gameCountries.map((country, index) => (
              <Flag
                key={country.cca3}
                country={country}
                onClick={handleClickedCountry}
                isLazy={index >= 20}
                disabled={gameState === "loaded"}
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
