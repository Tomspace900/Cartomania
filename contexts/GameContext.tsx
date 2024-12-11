"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Country, Region } from "@/ressources/types";
import _, { sample } from "lodash";
import { getCountries, getUNMembersCountries } from "@/ressources/getCountries";

export type IGameLoadingState = "idle" | "loading" | "playing" | "win" | "lose";

export type QuestionStatus = "idle" | "correct" | "incorrect";

interface IGameContext {
  gameState: IGameLoadingState;
  questionStatus: QuestionStatus;
  gameCountries: Country[];
  askedCountry?: Country;
  setGameState: (state: IGameLoadingState) => void;
  initGameState: (region?: Region, UNMembers?: boolean) => void;
  handleClickedCountry: (country: Country) => QuestionStatus;
  getRandomCountry: (countries: Country[]) => Country;
}

const initialState: IGameContext = {
  gameState: "idle",
  questionStatus: "idle",
  gameCountries: [],
  askedCountry: undefined,
  setGameState: () => {},
  initGameState: () => {},
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

  const getRandomCountry = useCallback((countries: Country[]): Country => {
    return sample(countries) as Country;
  }, []);

  const initGameState = (region?: Region, UNMembers?: boolean) => {
    setGameState("loading");
    const countries = UNMembers ? getUNMembersCountries() : getCountries();

    const filteredCountries = region
      ? countries.filter((country) => country.region === region)
      : countries;

    const shuffledCountries = _.shuffle(filteredCountries);
    const shuffledGameCountries = shuffledCountries.map((country) => ({
      ...country,
      isAsked: false,
      isCorrect: undefined,
    }));

    setGameCountries(shuffledGameCountries);
    setAskedCountry(getRandomCountry(shuffledGameCountries));
    setGameState("playing");
  };

  const handleClickedCountry = (country: Country): QuestionStatus => {
    if (!askedCountry) return "idle";
    if (country.cca2 === askedCountry.cca2) {
      setQuestionStatus("correct");
      const newGameCountries = gameCountries.filter(
        (c) => c.cca2 !== country.cca2,
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
    if (gameState === "playing" && gameCountries.length === 0)
      setGameState("win");
  }, [gameState, gameCountries]);

  const value = {
    gameState,
    questionStatus,
    gameCountries,
    setGameState,
    askedCountry,
    initGameState,
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
