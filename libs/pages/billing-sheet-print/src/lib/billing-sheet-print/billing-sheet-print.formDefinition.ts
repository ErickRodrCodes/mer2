// Import and use the common billing sheet form definition
import { createPrintBillingSheetFormDefinition } from '@mer-ui/common';

// Export all form definitions using the common helper
export const {
  consecutiveNumber,
  ACNumber,
  sonographer,
  faxNumber,
  dateOfService,
  amountToBePaid,
  checkNumber,
  cash,
  creditCard,
  facilityName,
  facilityAddress,
  facilityCity,
  facilityState,
  facilityZipcode,
  withAdmitDate,
  identification,
  patientMedicareNumber,
  patientFirstName,
  patientLasttName,
  patientDOB,
  primaryInsurance,
  primaryInsurancePolicyNumber,
  secondaryInsurance,
  secondaryInsurancePolicyNumber,
  authorizationNumber,
  groupNumber,
  orderingPhysician,
  symptomsOrDiagnosis,
  facilityLocationOption,
  patientSex
} = createPrintBillingSheetFormDefinition();
