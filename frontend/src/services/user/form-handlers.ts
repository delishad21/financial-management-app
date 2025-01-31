'use server';

import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from './definitions';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function handleRegister(
  state: FormState,
  formData: FormData,
): Promise<FormState> {

  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }


  const { name, email, password } = validatedFields.data;

  // Call the register function with the form data


  // Create Session

}

export async function handleLogin(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  const errorMessage = { message: 'Invalid login credentials.' };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // Call the login function with the form data

}

export async function logout() {
  // Destroy session
}