import { firestore } from 'firebase-admin';

import { Record } from './types';

const identifier = (record: Record): string => `records/${[
  record.householdNum,
  record.lastName,
  record.firstName,
  record.dob,
].join(',')}`;

export const storeRecord = async (record: Record): Promise<boolean> => {
  const ref = firestore().doc(identifier(record));
  if ((await ref.get()).exists) {
    return false;
  }

  await ref.set(record);
  return true;
};
