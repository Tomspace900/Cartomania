"use client";

import { useTheme } from "@/contexts/ThemeProvider";
import { Switch } from "./ui/switch";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = () =>
    toggleTheme(theme === "dark" ? "light" : "dark");

  return (
    <Switch
      isThemeSwitcher
      checked={theme === "dark"}
      defaultChecked={theme === "dark"}
      onCheckedChange={handleThemeChange}
    />
  );
};

export default ThemeSwitcher;
