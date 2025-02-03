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
import { forgetPassword, verifyCode } from "@/services/user/actions";
import { useRouter } from "next/navigation";
import { set } from "lodash";

const EmailConfirmation = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0); // Countdown state

  useEffect(() => {
    const savedCountdown = localStorage.getItem("countdown");
    if (savedCountdown) {
      setCountdown(Number(savedCountdown));
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      localStorage.setItem("countdown", countdown.toString());
    } else {
      setDisableSubmit(false);
      localStorage.removeItem("countdown");
      setMessage("");
      setError("");
    }
  }, [countdown]);

  // Handle countdown updates every second
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup interval when countdown reaches zero
    return () => clearInterval(timer);
  }, [countdown]);

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
      setMessage(
        "Password reset link sent to your email. Ensure that you open the link in the same browser."
      );
      setCountdown(60);
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
            sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
          >
            <Stack spacing={2}>
              <Typography
                fontWeight="700"
                variant="h3"
                mb={2}
                mt={2}
                textAlign="center"
                color="primary.main"
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
