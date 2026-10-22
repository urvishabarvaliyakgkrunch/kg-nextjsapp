// src/lib/auth.ts
// Every WordPress auth call lives here (§C1). Needs the "WPGraphQL JWT Authentication"
// plugin on the backend plus GRAPHQL_JWT_AUTH_SECRET_KEY in wp-config.php.

import { connection } from "next/server";
import { gql } from "@/lib/graphql";
import { isTokenFresh, readTokenExpiry } from "@/lib/jwt";
import { refreshAuthToken } from "@/lib/refreshToken";
import { getSession, saveSession } from "@/lib/session";
import type { Session } from "@/types/account";

const LOGIN = `
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
    }
  }
`;

// Woo sends its own "new account" email from this mutation — we do not email anyone from Next.js
const REGISTER = `
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
    $metaData: [MetaDataInput]
  ) {
    registerCustomer(
      input: {
        email: $email
        username: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        metaData: $metaData
        authenticate: true
      }
    ) {
      authToken
      refreshToken
    }
  }
`;

// WordPress sends the reset email itself, so the link in it stays the WordPress one
const SEND_RESET = `
  mutation SendReset($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      user { databaseId }
    }
  }
`;

const RESET = `
  mutation Reset($key: String!, $login: String!, $password: String!) {
    resetUserPassword(input: { key: $key, login: $login, password: $password }) {
      user { databaseId }
    }
  }
`;

interface TokenPair {
  authToken: string | null;
  refreshToken: string | null;
}

function toSession(pair: TokenPair, remember: boolean): Session {
  if (!pair.authToken || !pair.refreshToken) {
    throw new Error("WordPress did not return a login token.");
  }
  return {
    authToken: pair.authToken,
    refreshToken: pair.refreshToken,
    expiresAt: readTokenExpiry(pair.authToken),
    remember,
  };
}

// GraphQL says this when the JWT plugin is not active — shoppers must not read that wording
const PLUGIN_MISSING = /Cannot query field "(login|authToken|refreshToken|refreshJwtAuthToken)"/;

export class AuthPluginMissingError extends Error {
  constructor() {
    super("Sign-in is not available yet. Please try again later.");
    this.name = "AuthPluginMissingError";
  }
}

export async function login(
  username: string,
  password: string,
  remember = false
): Promise<Session> {
  try {
    const data = await gql<{ login: TokenPair }>(
      LOGIN,
      { username, password },
      { noCache: true }
    );
    return toSession(data.login, remember);
  } catch (error) {
    if (error instanceof Error && PLUGIN_MISSING.test(error.message)) {
      throw new AuthPluginMissingError();
    }
    throw error;
  }
}

export async function register(
  input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    // Extra user meta saved with the account — the age gate sends field_of_research here
    metaData?: { key: string; value: string }[];
  },
  remember = true
): Promise<Session> {
  try {
    const data = await gql<{ registerCustomer: TokenPair }>(
      REGISTER,
      input,
      { noCache: true }
    );
    return toSession(data.registerCustomer, remember);
  } catch (error) {
    // GraphQL checks the fields before it runs, so no half-made account is left behind
    if (error instanceof Error && PLUGIN_MISSING.test(error.message)) {
      throw new AuthPluginMissingError();
    }
    throw error;
  }
}

export async function sendPasswordResetEmail(username: string): Promise<void> {
  await gql(SEND_RESET, { username }, { noCache: true });
}

export async function resetPassword(
  key: string,
  loginName: string,
  password: string
): Promise<void> {
  await gql(RESET, { key, login: loginName, password }, { noCache: true });
}

// WordPress was unreachable. Thrown instead of returning null so that a slow backend
// never looks like a sign-out — error.tsx offers "try again", not the login box.
export class BackendUnreachableError extends Error {
  constructor() {
    super("Could not reach the store right now. Please try again.");
    this.name = "BackendUnreachableError";
  }
}

// The one function every account page calls — null means genuinely signed out.
// proxy.ts normally refreshes the cookie first, so this rarely has to do the work.
export async function getAuthToken(
  options: { persist?: boolean } = {}
): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;
  // Date.now() below is request-time only — tells Cache Components not to prerender this
  await connection();
  if (isTokenFresh(session.expiresAt)) return session.authToken;

  let authToken: string | null;
  try {
    authToken = await refreshAuthToken(session.refreshToken);
  } catch {
    // Refresh failed (network error or timeout) — treat as signed out so user
    // sees the login form instead of the error boundary, then can sign back in
    return null;
  }

  // WordPress rejected the refresh token — genuine sign-out
  if (!authToken) return null;

  if (options.persist) {
    await saveSession({ ...session, authToken, expiresAt: readTokenExpiry(authToken) });
  }
  return authToken;
}
