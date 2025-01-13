"use client";
import { baselightTheme, darkTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider } from "@mui/material";
import { ThemeContextProvider } from "./provider";

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
      <body>
        <ThemeContextProvider>
          {/* Replace with sign in checks */}
          {true ? application : landing}
        </ThemeContextProvider>
      </body>
    </html>
  );
}
