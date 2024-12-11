"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Theme } from "@/lib/types";

const COOKIE_KEY = "theme";
const COOKIE_EXPIRES = 12; // 12 hours

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  toggleTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  defaultTheme,
  children,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cookieTheme = Cookies.get(COOKIE_KEY) as Theme | undefined;
    if (cookieTheme) handleSetTheme(cookieTheme);
    else {
      const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      handleSetTheme(systemTheme ? "dark" : "light");
    }
  }, []);

  const handleSetTheme = (theme: Theme) => {
    setTheme(theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    handleSetTheme(newTheme);
    Cookies.set(COOKIE_KEY, newTheme, { expires: COOKIE_EXPIRES / 24 }); // Convert to days
  };

  return (
    mounted && (
      <ThemeProviderContext.Provider {...props} value={{ theme, toggleTheme }}>
        {children}
      </ThemeProviderContext.Provider>
    )
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
