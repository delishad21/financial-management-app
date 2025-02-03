"use client";
import Link from "next/link";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  IconButton,
  Badge,
  useTheme,
} from "@mui/material";
import PageContainer from "@/components/container/PageContainer";
import AuthLogin from "../../../../components/auth/AuthLogin";
import { useThemeContext } from "@/app/provider";
import { IconMoon, IconSun } from "@tabler/icons-react";

const Login = () => {
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

        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <AuthLogin title="Welcome Back" />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
