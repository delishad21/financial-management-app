"use client";
import { baselightTheme, darkTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider } from "@mui/material";
import { ThemeContextProvider } from "./provider";
import { PublicEnvScript } from "next-runtime-env";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function RootLayout({
  children,
  application,
  landing,
}: {
  children: React.ReactNode;
  application: React.ReactNode;
  landing: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeContextProvider>
            {/* Replace with sign in checks */}
            {false ? application : landing}
          </ThemeContextProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
