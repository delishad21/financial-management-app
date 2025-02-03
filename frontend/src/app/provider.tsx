"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { baselightTheme, darkTheme } from "@/utils/theme/DefaultColors";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // set dark on initialisation to avoid flash of light theme

  useEffect(() => {
    const storedTheme = localStorage.getItem("financial-planner-theme");
    if (storedTheme !== null) {
      setIsDarkMode(JSON.parse(storedTheme));
    } else {
      setIsDarkMode(false); // Default theme is light
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev: boolean) => {
      const newTheme = !prev;
      localStorage.setItem("financial-planner-theme", JSON.stringify(newTheme));
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={isDarkMode ? darkTheme : baselightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </ThemeContext.Provider>
  );
};
