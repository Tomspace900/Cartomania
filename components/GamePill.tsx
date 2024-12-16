"use client";

import { Country } from "@/ressources/types";
import { QuestionStatus } from "@/contexts/GameContext";
import { Clock } from "lucide-react";
import { formatTimer } from "@/lib/utils";

interface GamePillProps {
  country: Country;
  questionStatus: QuestionStatus;
  timer?: number;
}

export const GamePill = ({ country, questionStatus, timer }: GamePillProps) => {
  const DesktopTimer = () => (
    <div className="absolute left-[100%] sm:flex hidden items-center h-full ml-10">
      <div className="flex justify-center rounded-full border backdrop-blur-sm px-1 py-1 bg-input/[0.8] dark:bg-background/[0.8] border-primary">
        <div className="flex justify-center items-center gap-2 w-[100px]">
          <Clock className="h-5 w-5" />
          <span className="text-xl">{formatTimer(timer)}</span>
        </div>
      </div>
    </div>
  );

  const MobileTimer = () => (
    <div className="sm:hidden flex items-center gap-1">
      <Clock className="h-4 w-4 text-md" />
      <span className="text-md">{formatTimer(timer)}</span>
    </div>
  );

  const basePillClasses =
    "flex justify-center rounded-full border backdrop-blur-sm px-8 sm:py-3 py-1";
  const errorPillClasses =
    "bg-destructive text-destructive-foreground border-red";
  const successPillClasses = "bg-success text-success-foreground border-green";
  const defaultPillClasses =
    "bg-input/[0.8] dark:bg-background/[0.8] border-primary";

  const pillClasses = `${basePillClasses} ${questionStatus === "incorrect" ? errorPillClasses : questionStatus === "correct" ? successPillClasses : defaultPillClasses}`;

  return (
    <div className="fixed top-8 w-fit z-50 flex gap-4">
      <div className={pillClasses}>
        <div className="flex flex-col justify-center items-center">
          <span className="text-2xl">{country.name.common}</span>
          <MobileTimer />
        </div>
      </div>
      <DesktopTimer />
    </div>
  );
};
