import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  TextField,
} from "@mui/material";
import Link from "next/link";

import {
  handleLogin,
  handleResetPassword,
} from "@/services/user/form-handlers";
import { useFormState, useFormStatus } from "react-dom";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthResetPassword = ({ title, subtitle }: loginType) => {
  const [state, action] = useFormState(handleResetPassword, undefined);

  return (
    <form action={action}>
      {title ? (
        <Typography
          fontWeight="700"
          variant="h3"
          mb={2}
          mt={2}
          textAlign="center"
          color="primary.main"
        >
          {title}
        </Typography>
      ) : null}
      <Stack>
        <Box mt="25px">
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
                {state.errors.password.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Typography>
          )}
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="confirmPassword"
            mb="5px"
          >
            Confirm Password
          </Typography>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            variant="outlined"
            fullWidth
            type="password"
            placeholder="••••••••"
          />
          {state?.errors?.confirmPassword && (
            <Typography color="error" variant="body2" pt={2}>
              {state.errors.confirmPassword}
            </Typography>
          )}
        </Box>
      </Stack>
      <Box pt={5}>
        <ResetPasswordButton />
        {state?.message && (
          <Typography color="error" variant="body1" pt={2} textAlign="center">
            {state.message}
          </Typography>
        )}
      </Box>
      {subtitle}
    </form>
  );
};

export function ResetPasswordButton() {
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
      {pending ? "Resetting..." : "Confirm"}
    </Button>
  );
}

export default AuthResetPassword;
