import type { PublicMethodNamesOf } from '../../types/lib';
import type { DB } from './db';

// List of allowed DB method names (type-safe, shared for both main and preload)
export type DBMethodName = Extract<PublicMethodNamesOf<DB>, string>;

export const with_DB_AllowedMethodNames: readonly DBMethodName[] = [
  'dropIntakeFormTables',
  'listTables',
  'isTechnicianCodeInDB',
  'getTechnicianNameByCode',
  'loginTechnician',
  'addNewTechnician',
  'getListCPTCodes',
  'addNewCPTCode',
  'getPatientByCombinedKey',
  'addNewPatient',
  'intakeFormObtainNewPK',
  'recordIntakeForm',
  'getListsOfIntakesOfDay',
  'getIntakeFormToPrintPDF',
  'getFormById',
  'updateIntakeForm',
  'getFacilitiesByString',
  'recordNewFacility',
] as const;
