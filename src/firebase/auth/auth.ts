import { auth } from 'firebase-admin';
import { generate } from 'generate-password';

import { NewUserCredentials } from './types'; // eslint-disable-line

export const createNewUser = async (
  displayName: string,
  email: string,
  password?: string):
Promise<NewUserCredentials | null> => {
  const psw = password || generate({
    length: 8,
    numbers: true,
    uppercase: true,
  });
  try {
    const user = await auth().createUser({ displayName, email, password: psw });
    return { email: user.email, password: psw };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createNewCookie = async (token: string, expiresIn: number):
Promise<string | null> => {
  try {
    return await auth().createSessionCookie(token, { expiresIn });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const verifyCookie = async (cookie: string):
Promise<auth.UserRecord | null> => {
  try {
    const decoded = await auth().verifySessionCookie(cookie, true);
    return await auth().getUser(decoded.uid);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const revokeCookie = async (cookie: string): Promise<void> => {
  const token = await verifyCookie(cookie);
  if (token) {
    await auth().revokeRefreshTokens(token.uid);
  }
};

export const verifyToken = async (token: string):
Promise<auth.UserRecord | null> => {
  try {
    const decoded = await auth().verifyIdToken(token, true);
    return await auth().getUser(decoded.uid);
  } catch (e) {
    console.error(e);
    return null;
  }
};
