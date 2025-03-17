import { z } from 'zod';

/**
 * @description Zod schema to validate the structure of a technician object.
 */
export const ZTechnicianSchema = z.object({
  PK_techicianId: z.string(),
  technicianFirstName: z.string(),
  technicianLastName: z.string(),
  password: z.string(),
});

/**
 * @description Zod schema to validate the structure of an operator's device object.
 */
export const ZOperatorsDeviceSchema = z.object({
  technicians: z.array(ZTechnicianSchema),
});

/**
 * @description Zod schema to validate the structure of a technician object.
 */
export const ZCPTCodeOptionValue = z.object({
  optionId: z.string(),
  abbreviation: z.string(),
  label: z.string(),
});

/**
 * @description Zod schema to validate the structure of a CPT code option object.
 */
export const ZCPTCodeOption = z.object({
  type: z.string(),
  values: z.array(ZCPTCodeOptionValue).or(z.never()),
});

/**
 * @description Zod schema to validate the structure of a CPT code option object.This schema allows the `values` property to be either an array of `ZCPTCodeOptionValue` or `never`.
 */
const ZCPTCodeOptions = z.union([
  ZCPTCodeOption,
  z.object({}).refine((data) => Object.keys(data).length === 0, {
    message: 'Options can be an empty object.',
  }),
]);

/**
 * @description Zod schema to validate the structure of a CPT code object.
 */
export const ZCPTCodeSchema = z.object({
  id: z.number(),
  PK_cptcode: z.string(),
  abbreviation: z.string(),
  type: z.literal('CPT'),
  code: z.string(),
  description: z.string(),
  options: ZCPTCodeOptions,
});

/**
 * @description Zod schema to validate the structure of an unknown CPT code object.
 */
export const ZCPTUnknowCodeSchema = z.object({
  id: z.number(),
  PK_cptcode: z.string(),
  abbreviation: z.string(),
  type: z.literal('TEXT'),
  code: z.literal('Unlisted'),
  description: z.string(),
  value: z.string(),
});

/**
 * @description Zod schema to validate the structure of a CPT code object.
 */
export const ZCPTCode = z.union([ZCPTCodeSchema, ZCPTUnknowCodeSchema]);

/**
 * @description Zod schema to validate the structure of a patient object.
 */
export const ZPatientSchema = z.object({
  PK_Patient: z.string() /** composition of firstName, lastName and DOB **/,
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  sex: z.enum(['male', 'female', 'other']),
  identification: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  medicareNumber: z.string(),
  primareInsurance: z.string(),
  prinmaryInsurancePolicyNumber: z.string(),
  secondaryInsurance: z.string(),
  secondaryInsurancePolicyNumber: z.string(),
  authorizationNumber: z.string(),
  groupNumber: z.string(),
});

/**
 * @description Zod schema to validate the structure of an intake form object.
 */
export const ZIntakeFormSchema = z.object({
  PK_Intake: z.string(),
  acNumber: z.string(),
  sonographer: z.string(),
  faxNumber: z.string(),
  dateOfService: z.string(),
  amountToBePaid: z.string(),
  checkNumber: z.string(),
  cash: z.string(),
  creditCard: z.string(),
  facilityLocationType: z.string(),
  facilityName: z.string(),
  facilityAddress: z.string(),
  facilityCity: z.string(),
  facilityState: z.string(),
  facilityZipcode: z.string(),
  withAdmitDate: z.string(),
  identification: z.string(),
  patientMedicareNumber: z.string(),
  patientFirstName: z.string(),
  patientLasttName: z.string(),
  patientDOB: z.string(),
  patientSex: z.string(),
  primaryInsurance: z.string(),
  primaryInsurancePolicyNumber: z.string(),
  secondaryInsurance: z.string(),
  secondaryInsurancePolicyNumber: z.string(),
  authorizationNumber: z.string(),
  groupNumber: z.string(),
  orderingPhysician: z.string(),
  symptomsOrDiagnosis: z.string(),
  cptText: z.string(),
});

/**
 * @description Zod schema to validate the structure of a facilities object.
 */
export const ZFacilitiesSchema = z.object({
  facilityName: z.string(),
  facilityAddress: z.string(),
  facilityCity: z.string(),
  facilityState: z.string(),
  facilityZipcode: z.string(),
});

/**
 * Type that describes the structure of the operators device object.
 */
export type OperatorsDeviceSchema = z.infer<typeof ZOperatorsDeviceSchema>;

/**
 * Type that describes the structure of the technician object.
 */
export type TechnicianSchema = z.infer<typeof ZTechnicianSchema>;

/**
 * Type that describes the structure of the CPT code option value object.
 */
export type CPTCodeOptionValue = z.infer<typeof ZCPTCodeOptionValue>;

/**
 * Type that describes the structure of the CPT code option object.
 */
export type CPTCodeOption = z.infer<typeof ZCPTCodeOption>;

/**
 * Type that describes the structure of the CPT code options object.
 */
export type CPTCodeSchema = z.infer<typeof ZCPTCodeSchema>;

/**
 * Type that describes the structure of the unknown CPT code object.
 */
export type CPTUnknowCodeSchema = z.infer<typeof ZCPTUnknowCodeSchema>;

/**
 * Type that describes the structure of the CPT code object.
 */
export type CPTCode = z.infer<typeof ZCPTCode>;

/**
 * Type that describes the structure of the patient object.
 */
export type PatientSchema = z.infer<typeof ZPatientSchema>;

/**
 * Type that describes the structure of the intake form object.
 */
export type IntakeFormSchema = z.infer<typeof ZIntakeFormSchema>;

/**
 * Type that describes the structure of the facilities object.
 */
export type FacilitiesSchema = z.infer<typeof ZFacilitiesSchema>;
