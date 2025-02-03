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
import { resendCode, verifyCode } from "@/services/user/actions";
import { useRouter } from "next/navigation";
import { set } from "lodash";

const EmailConfirmation = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState<string>("");
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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to the previous box on backspace if empty
      const prevField = document.getElementById(`digit-${index - 1}`);
      prevField?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move cursor to the previous field32
      e.preventDefault();
      const prevField = document.getElementById(`digit-${index - 1}`);
      prevField?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move cursor to the next field
      e.preventDefault();
      const nextField = document.getElementById(`digit-${index + 1}`);
      nextField?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];
    pasteData.split("").forEach((char, i) => {
      if (/^\d$/.test(char)) {
        newCode[i] = char;
      }
    });
    setCode(newCode);

    // Focus the next empty field after the paste
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
    if (nextEmptyIndex !== -1) {
      const nextField = document.getElementById(`digit-${nextEmptyIndex}`);
      nextField?.focus();
    }
  };

  const handleConfirm = async () => {
    const enteredCode = Number(code.join(""));

    const response = await verifyCode(enteredCode);

    console.log(response);

    if (response.status === "error") {
      setError(response.message);
    }

    if (response.status === "success") {
      setMessage("Email confirmed successfully!");
      setError("");
      setCountdown(0); // Clear cooldown

      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return; // Prevent clicking if cooldown is active
    setCountdown(60); // Set cooldown to 60 seconds

    const response = await resendCode();
    if (response.status === "error") {
      setError(response.message);
      setCountdown(0); // Clear cooldown
    }
    if (response.status === "success") {
    }
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
    <>
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
            <Typography variant="h4" textAlign="center" fontWeight="600" mb={3}>
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
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
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

              {error && !message && (
                <Typography color="error" textAlign="center" mt={2}>
                  {error}
                </Typography>
              )}

              {message && (
                <Typography color="success" textAlign="center" mt={2}>
                  {message}
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
                <Typography color="primary" textAlign="center" p={2}>
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
    </>
  );
};

export default EmailConfirmation;
