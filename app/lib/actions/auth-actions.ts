'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

/**
 * Handles user login by authenticating with Supabase.
 *
 * @description This server action is the cornerstone of the user authentication process. It's called by the login form
 * to verify a user's credentials. By using Supabase's `signInWithPassword`, it securely authenticates the user
 * without exposing sensitive credentials to the client-side. A successful login establishes a session,
 * allowing the user to access protected routes and features, such as creating or voting on polls.
 *
 * @param {LoginFormData} data - The user's login credentials, containing email and password.
 * This data is validated by the login form component (`app/(auth)/login/page.tsx`) before being passed here.
 *
 * @returns {Promise<{ error: string | null }>} An object indicating the outcome.
 * Returns `{ error: null }` on successful authentication, allowing for redirection to the dashboard.
 * Returns `{ error: string }` if authentication fails (e.g., incorrect password, user not found),
 * which is then displayed to the user on the login page.
 *
 * @assumptions Assumes that the email and password correspond to an existing user in the Supabase `auth.users` table.
 * @edge_cases
 * - User provides an incorrect email or password.
 * - The user's account is not yet confirmed (if email verification is enabled in Supabase).
 * - Network issues prevent communication with the Supabase server.
 */
export async function login(data: LoginFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

/**
 * Registers a new user in the Supabase authentication system.
 *
 * @description This function enables new users to create an account. It's a critical feature for any application
 * that requires user-specific content or actions. It securely communicates with Supabase to create a new user record,
 * including custom metadata like the user's name.
 *
 * @param {RegisterFormData} data - The data for the new user, including name, email, and password.
 * This is collected from the registration form (`app/(auth)/register/page.tsx`).
 *
 * @returns {Promise<{ error: string | null }>} An object indicating the outcome.
 * Returns `{ error: null }` on successful registration.
 * Returns `{ error: string }` if registration fails (e.g., email already in use, weak password),
 * which is then displayed to the user.
 *
 * @assumptions Assumes the provided email is not already in use by another user.
 * @edge_cases
 * - The email address is already registered.
 * - The password does not meet Supabase's strength requirements.
 * - Invalid email format.
 */
export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

/**
 * Logs out the currently authenticated user.
 *
 * @description This server action terminates the user's session, effectively logging them out. It's essential for
 * security, allowing users to safely end their session on a shared or public computer. It's typically triggered
 * by a "Logout" button in the application's header or user menu.
 *
 * @returns {Promise<{ error: string | null }>} An object indicating the outcome.
 * Returns `{ error: null }` on successful logout.
 * Returns `{ error: string }` if an error occurs during the sign-out process.
 *
 * @assumptions Assumes there is an active user session to be terminated.
 * @edge_cases
 * - Attempting to log out when no user is signed in.
 * - Network issues preventing communication with Supabase.
 */
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Retrieves the currently authenticated user's data.
 *
 * @description This function is a server-side utility to fetch the profile of the logged-in user. It's used
 * across the application wherever user-specific information is needed, such as displaying the user's name
 * in the header or checking permissions for actions like editing or deleting a poll.
 *
 * @returns {Promise<User | null>} The Supabase `User` object if a user is authenticated, otherwise `null`.
 * The `User` object contains details like user ID, email, and custom metadata (e.g., name).
 *
 * @assumptions Assumes it's called in a context where a session might exist (e.g., a server component or another server action).
 * @connects_to
 * - `app/(dashboard)/layout.tsx`: To personalize the dashboard experience.
 * - `app/components/layout/header.tsx`: To display the user's name or an avatar.
 * - `poll-actions.ts`: To verify user ownership before performing sensitive operations like deleting a poll.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Retrieves the current user session.
 *
 * @description A lower-level utility than `getCurrentUser`, this function fetches the entire session object,
 * which includes the access token and user data. It's primarily used for server-side logic that needs to
 * inspect session details, such as in middleware to protect routes or for debugging purposes.
 *
 * @returns {Promise<Session | null>} The Supabase `Session` object if a session exists, otherwise `null`.
 *
 * @connects_to
 * - `middleware.ts`: Can be used to check for an active session and redirect unauthenticated users.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}