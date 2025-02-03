"use server";
import { Providers } from "./provider";
import { PublicEnvScript } from "next-runtime-env";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { isSessionLoggedIn } from "@/services/user/actions";

export default async function RootLayout({
  children,
  application,
  landing,
}: {
  children: React.ReactNode;
  application: React.ReactNode;
  landing: React.ReactNode;
}) {
  const isLoggedIn = await isSessionLoggedIn();

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <Providers>{isLoggedIn ? application : landing}</Providers>
      </body>
    </html>
  );
}
