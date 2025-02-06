"use server";

import {
  RegisterFormState,
  LoginFormState,
  LoginFormSchema,
  SignupFormSchema,
  ResetPasswordFormState,
  ResetPasswordFormSchema,
} from "./definitions";

import { login, resetPassword, signUp } from "./actions";
import { redirect } from "next/navigation";

export async function handleRegister(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the register function with the form data

  const response = await signUp(formData);

  if (response.status != "success") {
    return {
      message: response.message,
    };
  }

  // Redirect to email verification page
  redirect("/auth/email-confirmation");
}

export async function handleLogin(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the login function with the form data
  const response = await login(formData);

  if (response.status != "success") {
    return {
      message: response.message,
    };
  }

  // Redirect to dashboard
  redirect("/");
}

export async function handleResetPassword(
  state: ResetPasswordFormState,
  formData: FormData
) {
  const validatedFields = ResetPasswordFormSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const validPassword = validatedFields.data.password;

  // Call the reset password function
  const response = await resetPassword(validPassword);

  if (response.status != "success") {
    return {
      message: response.message,
    };
  }

  // Redirect to login page
  redirect("/auth/login");
}

export async function logout() {
  // Destroy session
}
