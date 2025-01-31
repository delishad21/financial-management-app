"use client";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  IconButton,
  Badge,
  TextField,
  Button,
} from "@mui/material";
import PageContainer from "@/components/container/PageContainer";
import { useThemeContext } from "@/app/provider";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const EmailConfirmation = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0); // Countdown state

  // Load countdown from localStorage if available
  useEffect(() => {
    const savedCountdown = localStorage.getItem("countdown");
    if (savedCountdown) {
      setCountdown(Number(savedCountdown));
    }
  }, []);

  // Save countdown to localStorage whenever it changes
  useEffect(() => {
    if (countdown > 0) {
      localStorage.setItem("countdown", countdown.toString());
    } else {
      localStorage.removeItem("countdown"); // Clear countdown when it reaches 0
    }
  }, [countdown]);

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically focus on the next box
    if (value && index < 5) {
      const nextField = document.getElementById(`digit-${index + 1}`);
      nextField?.focus();
    }

    // Reset error state when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleConfirm = () => {
    const enteredCode = code.join("");
    console.log("Code entered:", enteredCode);

    // Simulate error condition for now
    if (enteredCode !== "123456") {
      setError("The code entered is incorrect. Please try again.");
    } else {
      setError(""); // Reset error if code is correct
      // Proceed with email confirmation logic here
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return; // Prevent clicking if cooldown is active

    console.log("Resending code...");
    // Start cooldown countdown
    setCountdown(60);
  };

  // Handle countdown updates every second
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup interval when countdown reaches zero
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <PageContainer title="Email Confirmation" description="Confirm your email">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, rgb(48, 48, 48), rgb(0, 0, 0))",
            backgroundSize: "500% 500%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
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
              <Typography
                variant="h4"
                textAlign="center"
                fontWeight="600"
                mb={3}
              >
                Email Confirmation
              </Typography>

              <Typography variant="subtitle1" textAlign="center" mb={2}>
                Enter the 6-digit code sent to your email.
              </Typography>

              <Stack spacing={0}>
                <Stack direction="row" justifyContent="center" spacing={1}>
                  {code.map((digit, index) => (
                    <TextField
                      key={index}
                      id={`digit-${index}`}
                      value={digit}
                      onChange={(e) => handleInputChange(e.target.value, index)}
                      variant="outlined"
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "1.5rem",
                        },
                      }}
                      sx={{ width: "3rem" }}
                    />
                  ))}
                </Stack>

                {error && (
                  <Typography color="error" textAlign="center" mt={2}>
                    {error}
                  </Typography>
                )}


              {/* Resend Code Text */}
              {countdown === 0 ? (
                  <Typography
                    color="primary"
                    textAlign="center"
                    p={2}
                    sx={{ cursor: "pointer" }}
                    onClick={handleResendCode}
                  >
                    Didn't receive the code?{" "}
                    <span style={{ fontWeight: "bold" }}>Send again</span>
                  </Typography>
                ) : (
                  <Typography
                    color="primary"
                    textAlign="center"
                    p={2}
                  >
                    Please wait {countdown} seconds before sending again.
                  </Typography>
                )}

                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleConfirm}
                  disabled={code.some((digit) => digit === "")}
                >
                  Confirm Email
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default EmailConfirmation;
