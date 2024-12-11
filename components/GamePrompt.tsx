"use client";

import { Country } from "@/ressources/types";
import { QuestionStatus } from "@/contexts/GameContext";

interface GamePromptProps {
  country: Country;
  questionStatus: QuestionStatus;
}

export const GamePrompt = ({ country, questionStatus }: GamePromptProps) => {
  return (
    <div className="fixed top-10 w-fit z-50">
      <div
        className={`flex justify-center rounded-full border backdrop-blur-sm px-8 py-3 ${
          questionStatus === "incorrect"
            ? "bg-destructive text-destructive-foreground border-red"
            : questionStatus === "correct"
              ? "bg-success text-success-foreground border-green"
              : "bg-input/[0.8] dark:bg-background/[0.8] border-primary"
        }`}
      >
        <span className="text-2xl">{country.name.common}</span>
      </div>
    </div>
  );
};
