"use client";

import { Country } from "@/ressources/types";
import { QuestionStatus } from "@/contexts/GameContext";
import { Clock } from "lucide-react";
import { formatTimer } from "@/lib/utils";

interface GamePromptProps {
  country: Country;
  questionStatus: QuestionStatus;
  timer?: number;
}

export const GamePrompt = ({
  country,
  questionStatus,
  timer,
}: GamePromptProps) => {
  const renderTimer = () => {
    if (timer) {
      return (
        <div className="flex justify-left items-center gap-2 w-[100px]">
          <Clock className="text-2xl" />
          <span className="text-2xl">{formatTimer(timer)}</span>
        </div>
      );
    }
  };

  return (
    <div className="fixed top-8 w-fit z-50">
      <div
        className={`relative flex justify-center rounded-full border backdrop-blur-sm px-8 py-3 ${
          questionStatus === "incorrect"
            ? "bg-destructive text-destructive-foreground border-red"
            : questionStatus === "correct"
              ? "bg-success text-success-foreground border-green"
              : "bg-input/[0.8] dark:bg-background/[0.8] border-primary"
        }`}
      >
        <span className="text-2xl">{country.name.common}</span>
        <div className="absolute w-[100px] -left-[100px]">{renderTimer()}</div>
      </div>
    </div>
  );
};
