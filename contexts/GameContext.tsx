"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ContinentCode, Country, Subregion } from "@/ressources/types";
import _, { sample } from "lodash";
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

interface IGameContext {
  gameState: IGameLoadingState;
  questionStatus: QuestionStatus;
  gameCountries: Country[];
  askedCountry?: Country;
  timer: number;
  setGameState: (state: IGameLoadingState) => void;
  initGameState: (
    continentCode?: ContinentCode,
    subregion?: Subregion,
    UNMembers?: boolean,
  ) => void;
  startGame: () => void;
  handleClickedCountry: (country: Country) => QuestionStatus;
  getRandomCountry: (countries: Country[]) => Country;
}

const initialState: IGameContext = {
  gameState: "idle",
  questionStatus: "idle",
  gameCountries: [],
  askedCountry: undefined,
  timer: 0,
  setGameState: () => {},
  initGameState: () => {},
  startGame: () => {},
  handleClickedCountry: () => "idle",
  getRandomCountry: () => ({}) as Country,
};

const GameContext = createContext<IGameContext>(initialState);

export function GameProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [gameState, setGameState] = useState<IGameLoadingState>("idle");
  const [gameCountries, setGameCountries] = useState<Country[]>([]);
  const [askedCountry, setAskedCountry] = useState<Country>();
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>("idle");
  const { timer, startTimer, stopTimer } = useTimer();
  const { toast } = useToast();

  const getRandomCountry = useCallback((countries: Country[]): Country => {
    return sample(countries) as Country;
  }, []);

  const startGame = () => {
    setGameState("playing");
    startTimer();
  };

  const initGameState = (
    continentCode?: ContinentCode,
    subregion?: Subregion,
    UNMembers?: boolean,
  ) => {
    setGameState("loading");
    const countries = UNMembers ? getUNMembersCountries() : getCountries();

    const filteredCountries = continentCode
      ? countries.filter(
          (country) => country.am5.continentCode === continentCode,
        )
      : subregion
        ? countries.filter((country) => country.subregion === subregion)
        : countries;

    const shuffledCountries = _.shuffle(filteredCountries);
    const shuffledGameCountries = shuffledCountries.map((country) => ({
      ...country,
      isAsked: false,
      isCorrect: undefined,
    }));

    if (shuffledGameCountries.length === 0) {
      setGameState("error");
      return;
    }

    setGameCountries(shuffledGameCountries);
    setAskedCountry(getRandomCountry(shuffledGameCountries));
    setGameState("loaded");
  };

  const handleClickedCountry = (country: Country): QuestionStatus => {
    if (!askedCountry) return "idle";
    if (country.cca3 === askedCountry.cca3) {
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
      setQuestionStatus("incorrect");
      setTimeout(() => setQuestionStatus("idle"), 500);
      return "incorrect";
    }
  };

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
    gameCountries,
    timer,
    setGameState,
    askedCountry,
    initGameState,
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
