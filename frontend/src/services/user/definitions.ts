import { z } from "zod";
import { SessionOptions } from "iron-session";
import { env } from "next-runtime-env";


export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must be at most 30 characters long." })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: "Username can only contain letters, numbers, '.', '_', or '-'. No spaces allowed.",
    })
    .regex(/^(?!.*[._-]{2}).*$/, {
      message: "Username cannot have consecutive special characters.",
    })
    .regex(/^[^._-].*[^._-]$/, {
      message: "Username cannot start or end with '.', '_', or '-'.",
    })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password field must not be empty." }),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
        register?: string;
      };
      message?: string;
    }
  | undefined;

/* -------------------
  Session Definitions
--------------------- */

const SECRET_KEY =
  env("SESSIONS_SECRET_KEY") || "ThisIsASecretKeyMaybeYouShouldChangeIt";

export interface SessionData {
  userId?: string;
  username?: string;
  email?: string;
  isAdmin: boolean;
  accessToken?: string;
  isLoggedIn: boolean;
}

export interface CreateUserSessionData {
  emailToken?: string;
  isPending: boolean;
  ttl?: string;
}

export interface EmailChangeSessionData {
  emailToken?: string;
  ttl?: string;
}

export interface ResetPasswordSessionData {
  resetToken?: string;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  isAdmin: false,
};

export const sessionOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "main-session",
  cookieOptions: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60,
  },
};

export const createUserOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "user-creation-session",
  cookieOptions: {
    httpOnly: true,
    secure: false,
    maxAge: 3 * 60,
  },
};

export const emailChangeOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "email-change-session",
  cookieOptions: {
    httpOnly: true,
    secure: false,
    maxAge: 3 * 60,
  },
};

export const resetPasswordOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: "reset-password-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3 * 60,
  },
};