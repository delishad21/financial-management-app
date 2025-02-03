"use client";

import {
  Box,
  Button,
  Grid,
  Typography,
  Stack,
  useTheme,
  Badge,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import PageContainer from "@/components/container/PageContainer";
import lightGraphic from "@/public/financial-graphic-light.png";
import darkGraphic from "@/public/financial-graphic-dark.png";
import { useThemeContext } from "@/app/provider";
import { IconMoon, IconSun } from "@tabler/icons-react";

const HomePage = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <PageContainer
      title="Financial Planner"
      description="Plan your finances smarter"
    >
      <Box
        sx={{
          padding: 4,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(145deg, ${
            isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main
          } 40%, ${
            isDarkMode ? theme.palette.grey[900] : theme.palette.grey[200]
          } 0%)`,
        }}
      >
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" fontWeight="bold">
            Financial Planner
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" href="/auth/login">
              Login
            </Button>
            <Button variant="contained" href="/auth/register">
              Sign Up
            </Button>
            <IconButton
              size="large"
              aria-label="show 11 new notifications"
              color="inherit"
              aria-controls="msgs-menu"
              aria-haspopup="true"
              onClick={toggleTheme}
            >
              <Badge variant="dot" color="primary">
                {isDarkMode ? (
                  <IconMoon size="21" stroke="1.5" />
                ) : (
                  <IconSun size="21" stroke="1.5" />
                )}
              </Badge>
            </IconButton>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center"
          >
            {/* Graphic Section */}
            <Grid item xs={12} md={5} pr={5}>
              <Box>
                <Image
                  src={isDarkMode ? darkGraphic : lightGraphic}
                  alt="Financial Planner Graphic"
                  width={700}
                  height={400}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            </Grid>

            {/* Text Section */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                align="left"
              >
                Easy to use financial management tool
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                paragraph
                align="left"
              >
                Import your bank statements from many sources and get a clear
                view of your finances
              </Typography>

              <Stack direction="row" spacing={2} mt={2} alignItems="flex-start">
                <Button variant="contained" size="large" href="/signup">
                  Get Started
                </Button>
                <Button variant="outlined" size="large" href="/login">
                  Already have an account?
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default HomePage;
