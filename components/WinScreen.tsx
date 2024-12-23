import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { Button } from "./ui/button";
import { continentCoordinates, formatTimer } from "@/lib/utils";
import { Timer, X } from "lucide-react";
import Glob from "@/components/Glob";
import { Am5ContinentId, ContinentCode } from "@/ressources/types";
import { useGameState } from "@/contexts/GameContext";
import { isEmpty } from "lodash";
import { LoadingState } from "@/lib/types";
import { loadGeodata } from "@/ressources/loadGeoData";
import { getContinentByCode } from "@/ressources/getCountries";

interface IWinScreenProps {
  continentCode?: ContinentCode;
  gameParams: any;
}

const WinScreen = ({ continentCode, gameParams }: IWinScreenProps) => {
  const [loading, setLoading] = useState<LoadingState>("idle");
  // eslint-disable-next-line no-undef
  const [geoData, setGeoData] = useState<GeoJSON.GeoJSON[]>([]);
  const { initGame, timer, totalErrorCount } = useGameState();

  const currentContinent: Am5ContinentId | undefined =
    getContinentByCode(continentCode)?.am5Id;

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading("loading");
      const places = ["continents"];
      if (currentContinent) {
        places.push(`region/world/${currentContinent}`);
      }

      try {
        await loadGeodata(places, (data) => {
          setGeoData((prev) => [...prev, data]);
        });
        setLoading("done");
      } catch (error) {
        console.error(error);
        setLoading("failed");
      }
    };

    fetchGeoData();
  }, [currentContinent]);

  useEffect(() => {
    console.log("geoData", geoData);
  }, [geoData]);

  const computeRotateTo = (): [number, number] => {
    const { latitude, longitude } = continentCode
      ? continentCoordinates[continentCode]
      : { latitude: 0, longitude: 0 };
    return [latitude, longitude];
  };

  return (
    <>
      <ReactConfetti
        height={document.documentElement.scrollHeight}
        width={window.innerWidth}
        recycle={false}
        numberOfPieces={1000}
        gravity={0.2}
      />
      <div className="flex flex-col h-full justify-center items-center mt-10 text-2xl gap-4">
        <div>{`Bravo t'es un(e) chef`}</div>
        {timer && (
          <div className="flex items-center gap-2">
            <Timer className="h-8 w-8" />
            {formatTimer(timer)}
          </div>
        )}
        <div className="flex items-center gap-2">
          <X className="h-8 w-8" />
          {`${totalErrorCount} errors`}
        </div>
        <Button className="mt-10" onClick={() => initGame(gameParams)}>
          Rejouer
        </Button>
        <div className="max-w-full w-[400px] min-h-[300px] flex-grow">
          {loading === "done" && !isEmpty(geoData) && (
            <Glob
              name="win"
              geoData={geoData}
              rotateTo={computeRotateTo()}
              highlightedPolygonId={currentContinent}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default WinScreen;
