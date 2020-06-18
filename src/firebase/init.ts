import * as sa from 'credentials.json';
import { ServiceAccount, credential, initializeApp } from 'firebase-admin';

export default (): void => {
  initializeApp({
    credential: credential.cert(sa as ServiceAccount),
    databaseURL: process.env.DB_URL,
  });
};
