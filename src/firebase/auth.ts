import { auth } from 'firebase-admin';

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
