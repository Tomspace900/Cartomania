"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ContinentCode, Country, Subregion } from "@/ressources/types";
import _ from "lodash";
import { getCountries, getUNMembersCountries } from "@/ressources/getCountries";
import { useTimer } from "@/hooks/use-timer";

import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export type IGameLoadingState =
  | "idle"
  | "loading"
  | "loaded"
  | "playing"
  | "win"
  | "lose"
  | "error";

export type QuestionStatus = "idle" | "correct" | "incorrect";

export type GameCountry = Country & { disabled: boolean };

interface IGameContext {
  gameState: IGameLoadingState;
  questionStatus: QuestionStatus;
  errorCount: number;
  totalErrorCount: number;
  gameCountries: GameCountry[];
  askedCountry?: GameCountry;
  timer: number;
  setGameState: (state: IGameLoadingState) => void;
  initGame: ({
    continentCode,
    subregion,
    UNMembersOnly,
  }: {
    continentCode?: ContinentCode;
    subregion?: Subregion;
    UNMembersOnly?: boolean;
  }) => void;
  startGame: () => void;
  handleClickedCountry: (country: GameCountry) => QuestionStatus;
  getRandomCountry: (countries: GameCountry[]) => GameCountry;
}

const initialState: IGameContext = {
  gameState: "idle",
  questionStatus: "idle",
  errorCount: 0,
  totalErrorCount: 0,
  gameCountries: [],
  askedCountry: undefined,
  timer: 0,
  setGameState: () => {},
  initGame: () => {},
  startGame: () => {},
  handleClickedCountry: () => "idle",
  getRandomCountry: () => ({}) as GameCountry,
};

const GameContext = createContext<IGameContext>(initialState);

export function GameProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [gameState, setGameState] = useState<IGameLoadingState>("idle");
  const [gameCountries, setGameCountries] = useState<GameCountry[]>([]);
  const [askedCountry, setAskedCountry] = useState<GameCountry>();
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>("idle");
  const [errorCount, setErrorCount] = useState(0);
  const [totalErrorCount, setTotalErrorCount] = useState(0);
  const { timer, startTimer, stopTimer } = useTimer();
  const { toast } = useToast();

  const getRandomCountry = useCallback(
    (countries: GameCountry[]): GameCountry => {
      return _.sample(countries) as GameCountry;
    },
    [],
  );

  const initGame = ({
    continentCode,
    subregion,
    UNMembersOnly,
  }: {
    continentCode?: ContinentCode;
    subregion?: Subregion;
    UNMembersOnly?: boolean;
  }) => {
    setGameState("loading");
    const countries = UNMembersOnly ? getUNMembersCountries() : getCountries();

    const filteredCountries = continentCode
      ? countries.filter(
          (country) => country.am5.continentCode === continentCode,
        )
      : subregion
        ? countries.filter((country) => country.subregion === subregion)
        : countries;

    const shuffledCountries: Country[] = _.shuffle(filteredCountries);
    const shuffledGameCountries: GameCountry[] = shuffledCountries.map(
      (country) => ({
        ...country,
        disabled: false,
      }),
    );

    if (shuffledGameCountries.length === 0) {
      setGameState("error");
      return;
    }

    setErrorCount(0);
    setTotalErrorCount(0);
    setGameCountries(shuffledGameCountries);
    setAskedCountry(getRandomCountry(shuffledGameCountries));
    setGameState("loaded");
  };

  const startGame = () => {
    setGameState("playing");
    startTimer();
  };

  const handleClickedCountry = (country: GameCountry): QuestionStatus => {
    if (!askedCountry) return "idle";
    if (country.cca3 === askedCountry.cca3) {
      setErrorCount(0);
      setQuestionStatus("correct");
      const newGameCountries = gameCountries.filter(
        (c) => c.cca3 !== country.cca3,
      );
      setTimeout(() => {
        setGameCountries(newGameCountries);
        setAskedCountry(getRandomCountry(newGameCountries));
        setQuestionStatus("idle");
      }, 500);
      return "correct";
    } else {
      setErrorCount((prev) => prev + 1);
      setTotalErrorCount((prev) => prev + 1);
      setQuestionStatus("incorrect");
      setTimeout(() => setQuestionStatus("idle"), 500);
      return "incorrect";
    }
  };

  useEffect(() => {
    switch (errorCount) {
      case 1:
      case 2: {
        // Disable half of the wrong countries not disabled
        const enabledCountries = gameCountries.filter(
          (c) => !c.disabled && c.cca3 !== askedCountry?.cca3,
        );
        const toDisableCount = Math.floor(enabledCountries.length / 2);
        const shuffled = _.shuffle(enabledCountries).slice(0, toDisableCount);

        setGameCountries((prev) =>
          prev.map((country) =>
            shuffled.some((c) => c.cca3 === country.cca3)
              ? { ...country, disabled: true }
              : country,
          ),
        );
        break;
      }
      case 3: {
        // Disable all the wrong countries
        setGameCountries((prev) =>
          prev.map((country) =>
            country.cca3 === askedCountry?.cca3
              ? country
              : { ...country, disabled: true },
          ),
        );
        break;
      }
      default: {
        // Enable all the countries
        setGameCountries((prev) =>
          prev.map((country) => ({ ...country, disabled: false })),
        );
        break;
      }
    }
  }, [errorCount, setGameCountries, askedCountry]);

  useEffect(() => {
    if (gameState === "playing" && gameCountries.length === 0) {
      setGameState("win");
      stopTimer();
    }
    if (gameState === "error") {
      stopTimer();
      toast({
        variant: "destructive",
        title: "Oups ! 😅",
        description: "Tout ne s'est pas passé comme prévu, désolé\u00A0!",
      });
      redirect("/");
    }
  }, [gameState, gameCountries]);

  const value = {
    gameState,
    questionStatus,
    errorCount,
    totalErrorCount,
    gameCountries,
    timer,
    setGameState,
    askedCountry,
    initGame,
    startGame,
    handleClickedCountry,
    getRandomCountry,
  };

  return (
    <GameContext.Provider {...props} value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameState = () => {
  const context = useContext(GameContext);

  if (context === undefined)
    throw new Error("useGameState must be used within a GameProvider");

  return context;
};
