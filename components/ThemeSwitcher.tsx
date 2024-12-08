"use client";

import { useTheme } from "@/contexts/ThemeProvider";
import { Switch } from "./ui/switch";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => setTheme(theme === "dark" ? "light" : "dark");

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
