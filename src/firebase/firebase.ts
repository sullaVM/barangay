import * as sa from 'credentials.json';
import {
  ServiceAccount,
  auth,
  credential,
  initializeApp,
} from 'firebase-admin';

export const initFirebase = (): void => {
  initializeApp({
    credential: credential.cert(sa as ServiceAccount),
    databaseURL: process.env.DB_URL,
  });
};

export const createNewCookie = async (token: string, expiresIn: number):
Promise<string | null> => {
  try {
    return await auth().createSessionCookie(token, { expiresIn });
  } catch (e) {
    return null;
  }
};

export const verifyCookie = async (cookie: string):
Promise<auth.DecodedIdToken | null> => {
  try {
    return await auth().verifySessionCookie(cookie, true);
  } catch (e) {
    return null;
  }
};

export const revokeCookie = async (cookie: string): Promise<void> => {
  const token = await verifyCookie(cookie);
  if (token) {
    await auth().revokeRefreshTokens(token.uid);
  }
};
