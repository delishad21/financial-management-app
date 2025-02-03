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

import { handleLogin } from "@/services/user/form-handlers";
import { useFormState, useFormStatus } from "react-dom";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle }: loginType) => {
  const [state, action] = useFormState(handleLogin, undefined);

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
      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Username/Email
          </Typography>
          <TextField
            id="identifier"
            name="identifier"
            variant="outlined"
            fullWidth
            placeholder="johndoe/johndoe@gmail.com"
          />
          {state?.errors?.identifier && (
            <Typography color="error" variant="body2" pt={2}>
              {state.errors.identifier}
            </Typography>
          )}
        </Box>
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
              {state.errors.password}
            </Typography>
          )}
        </Box>
        <Stack justifyContent="left" direction="row" alignItems="center" my={2}>
          {/* Checkbox for remembering password.
        TODO: Update backend to support one time login */}
          {/* <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remeber this Device"
          />
        </FormGroup> */}
          <Typography
            component={Link}
            href="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <LoginButton />
        {state?.message && (
          <Typography color="error" variant="body1" pt={2} textAlign="center">
            {state.message}
          </Typography>
        )}
        <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
          <Typography color="textSecondary" fontWeight="500">
            New to Financial Manager?
          </Typography>
          <Typography
            component={Link}
            href="/auth/register"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Create an account
          </Typography>
        </Stack>
      </Box>
      {subtitle}
    </form>
  );
};

export function LoginButton() {
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
      {pending ? "Logging in..." : "Sign In"}
    </Button>
  );
}

export default AuthLogin;
