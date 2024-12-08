"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Theme } from "@/lib/types";

const COOKIE_KEY = "theme";
const COOKIE_EXPIRES = 12; // 12 hours

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useState<Theme>(isDark ? "dark" : "light");

  useEffect(() => {
    const cookieTheme = Cookies.get(COOKIE_KEY) as Theme | undefined;
    if (cookieTheme) {
      setTheme(cookieTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      Cookies.set(COOKIE_KEY, theme, { expires: COOKIE_EXPIRES / 24 }); // Convert to days
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
