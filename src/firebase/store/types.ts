interface RecordBase {
  region: string;
  province: string;
  city: string;
  barangay: string;
  middleName: string;
  extName: string;
  placeOfBirth: string;
  sex: Sex;
  maritalStatus: MaritalStatus;
  citizenship: string;
  occupation: string;
  houseAddressNum?: number;
  street: string;
  purok: string;
  sitio: string;
  houseHeadRelation: string;
}

export interface RecordIdentifier {
  lastName: string;
  firstName: string;
  dob: Date;
  householdNum?: number;
}

export interface RecordMetadata {
  dateAccomplished: Date;
  submittedByRole: RoleInfo;
  lastChanged: LastChangedInfo;
}

export type Record = RecordBase & RecordIdentifier & RecordMetadata;

export type RecordUpload = RecordBase & RecordIdentifier;

export enum Sex {
  MALE,
  FEMALE,
}

export enum MaritalStatus {
  SINGLE,
  MARRIED,
  WIDOWED,
  SEPARATED,
}

export interface LastChangedInfo {
  timestamp: Date;
  role: RoleInfo;
}

export interface RoleInfo {
  name: string;
  email: string;
}
