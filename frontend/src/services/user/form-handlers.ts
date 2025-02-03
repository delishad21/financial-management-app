"use server";

import {
  RegisterFormState,
  LoginFormState,
  LoginFormSchema,
  SignupFormSchema,
} from "./definitions";

import { login, signUp } from "./actions";
import { redirect } from "next/navigation";

export async function handleRegister(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
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

export async function logout() {
  // Destroy session
}
