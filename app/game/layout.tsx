import { GameProvider } from "@/contexts/GameContext";
import React from "react";

const GameLayout = ({ children }: { children: React.ReactNode }) => {
  return <GameProvider>{children}</GameProvider>;
};

export default GameLayout;
