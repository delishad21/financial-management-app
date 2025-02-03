"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { handleRegister } from "@/services/user/form-handlers";
import Link from "next/link";

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
}

export default function AuthRegister({ title, subtitle }: registerType) {
  const [state, action] = useFormState(handleRegister, undefined);

  return (
    <form action={action}>
      {title ? (
        <Typography
          fontWeight="700"
          variant="h3"
          mb={5}
          mt={2}
          textAlign="center"
          color="primary.main"
        >
          {title}
        </Typography>
      ) : null}

      <Box>
        <Stack spacing={3} mb={3}>
          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Username
            </Typography>
            <TextField
              id="username"
              name="username"
              variant="outlined"
              fullWidth
              placeholder="johndoe"
            />
            {state?.errors?.username && (
              <Typography color="error" variant="body2" pt={2}>
                {state.errors.username}
              </Typography>
            )}
          </div>

          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email Address
            </Typography>
            <TextField
              id="email"
              name="email"
              variant="outlined"
              fullWidth
              placeholder="john@example.com"
            />
            {state?.errors?.email && (
              <Typography color="error" variant="body2" pt={2}>
                {state.errors.email}
              </Typography>
            )}
          </div>

          <div>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <TextField
              id="password"
              name="password"
              variant="outlined"
              fullWidth
              type="password"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <Typography color="error" variant="body2" pt={2}>
                Password must:
                <ul>
                  {state.errors.password.map((error: any) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </Typography>
            )}
          </div>
        </Stack>

        <SignupButton />
        {state?.message && (
          <Typography color="error" variant="body1" pt={2}>
            {state.message}
          </Typography>
        )}
        <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Already have an Account?
          </Typography>
          <Typography
            component={Link}
            href="/auth/login"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Sign In
          </Typography>
        </Stack>
      </Box>
      {subtitle}
    </form>
  );
}

export function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      color="primary"
      variant="contained"
      size="large"
      fullWidth
      type="submit"
      disabled={pending}
    >
      {pending ? "Submitting..." : "Sign Up"}
    </Button>
  );
}
