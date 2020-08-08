import { firestore } from 'firebase-admin';

import { Record, RecordIdentifier } from './types';

export const identifier = (record: Record | RecordIdentifier):
string => `records/${[
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

export const getHouseholdRecords = async (num: string): Promise<Record[]> => {
  const snapshot = await firestore()
    .collection('records')
    .where('householdNum', '==', num)
    .get();
  const records = [];
  snapshot.forEach(doc => records.push(doc.data()));
  return records;
};

export const getRecords = async (iden: RecordIdentifier): Promise<Record[]> => {
  if (iden.householdNum) {
    if (iden.firstName && iden.lastName && iden.dob) {
      const doc = await firestore().doc(identifier(iden)).get();
      return doc.exists ? [doc.data()] as Record[] : [];
    }
    return getHouseholdRecords(iden.householdNum);
  }

  const snapshot = await firestore().collection('records')
    .where('lastName', '==', iden.lastName)
    .where('firstName', '==', iden.firstName)
    .where('dob', '==', iden.dob)
    .get();
  const records = [];
  snapshot.forEach(doc => records.push(doc.data()));
  return records;
};

export const modifyRecords = async (key: string, record: Record):
Promise<boolean> => {
  try {
    if (key === identifier(record)) {
      await firestore().doc(key).update(record);
    } else {
      if (!await storeRecord(record)) {
        return false;
      }
      await firestore().doc(key).delete();
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
