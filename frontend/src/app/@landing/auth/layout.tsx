"use client";
import { useThemeContext } from "@/app/provider";
import PageContainer from "@/components/container/PageContainer";
import { Badge, Box, IconButton, useTheme } from "@mui/material";
import { IconMoon, IconSun } from "@tabler/icons-react";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: `linear-gradient(145deg, ${
              isDarkMode
                ? theme.palette.primary.dark
                : theme.palette.primary.main
            } 50%, ${
              isDarkMode ? theme.palette.grey[900] : theme.palette.grey[200]
            } 0%)`,
            position: "absolute",
            height: "100%",
            width: "100%",
          },
        }}
      >
        <IconButton
          size="large"
          aria-label="toggle dark mode"
          color="inherit"
          onClick={toggleTheme}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <Badge variant="dot" color="primary">
            {isDarkMode ? (
              <IconMoon size="21" stroke="1.5" />
            ) : (
              <IconSun size="21" stroke="1.5" />
            )}
          </Badge>
        </IconButton>
        {children}
      </Box>
    </PageContainer>
  );
}
