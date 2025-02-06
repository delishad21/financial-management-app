"use client";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { forgetPassword } from "@/services/user/actions";
import { set } from "lodash";

const EmailConfirmation = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0); // Countdown state

  // Helper function to calculate remaining time
  const getRemainingTime = () => {
    const targetTime = localStorage.getItem("countdownEndTime");
    if (!targetTime) return 0;

    const endTime = Number(targetTime);
    const currentTime = Date.now();

    // Calculate remaining time
    const remainingTime = Math.max(0, endTime - currentTime);
    return Math.floor(remainingTime / 1000); // in seconds
  };

  useEffect(() => {
    const savedCountdown = getRemainingTime();
    setCountdown(savedCountdown);

    // If countdown is greater than zero, start the timer
    if (savedCountdown > 0) {
      setMessage(
        "Password reset link sent to your email. Ensure that you open the link in the same browser."
      );
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem("countdownEndTime");
            setMessage("");
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const handleSubmit = async () => {
    if (!identifier) {
      setError("Please enter your username or email.");
      return;
    }
    setDisableSubmit(true);
    const response = await forgetPassword(identifier);

    console.log(response);

    if (response.status !== "success") {
      setError(response.message);
      setDisableSubmit(false);
    }

    if (response.status === "success") {
      // Set the target end time (current time + 30 seconds)
      const countdownEndTime = Date.now() + 30 * 1000; // 30 seconds from now
      localStorage.setItem("countdownEndTime", countdownEndTime.toString());
      setCountdown(30);
    }
  };

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
            sx={{
              p: 4,
              zIndex: 1,
              width: "100%",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => router.back()}
              sx={{ position: "absolute", left: 2, top: 5 }}
            >
              <ArrowBack />
            </IconButton>
            <Stack spacing={2}>
              <Typography
                fontWeight="700"
                variant="h3"
                color="primary.main"
                sx={{ textAlign: "center", width: "100%" }}
              >
                Forgot Password
              </Typography>

              <Typography variant="subtitle1" textAlign="center" mb={2}>
                Forgot your password? No worries! Enter your username or email
                and we'll send you a reset link.
              </Typography>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Username/Email
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="johndoe/johndoe@gmail.com"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </Box>
              {error && !message && (
                <Typography color="error" textAlign="center" mt={2}>
                  {error}
                </Typography>
              )}

              <Box>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={disableSubmit || countdown > 0}
                >
                  Submit
                </Button>
                {countdown > 0 && (
                  <Typography color="primary" textAlign="center" mt={1}>
                    {`Resend code in ${countdown} seconds`}
                  </Typography>
                )}
                {message && (
                  <Typography color="success" textAlign="center" mt={2}>
                    {message}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default EmailConfirmation;
