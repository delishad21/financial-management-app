'use server';

import {
  FormState,
  LoginFormSchema,
  SignupFormSchema,
} from './definitions';

import { signUp } from './actions';
import { redirect } from 'next/navigation';

export async function handleRegister(
  state: FormState,
  formData: FormData,
): Promise<FormState> {

  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
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
      errors: {
        register: response.message
      }
    }
  }

  // Redirect to email verification page
  redirect('/auth/email-confirmation');

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