import { InputTextFields } from '@mer-ui/ui-input-text-field';
import {
  ACNumber,
  amountToBePaid,
  authorizationNumber,
  cash,
  checkNumber,
  consecutiveNumber,
  creditCard,
  dateOfService,
  facilityAddress,
  facilityCity,
  facilityLocationOption,
  facilityName,
  facilityState,
  facilityZipcode,
  faxNumber,
  groupNumber,
  identification,
  orderingPhysician,
  patientDOB,
  patientFirstName,
  patientLasttName,
  patientMedicareNumber,
  patientSex,
  primaryInsurance,
  primaryInsurancePolicyNumber,
  secondaryInsurance,
  secondaryInsurancePolicyNumber,
  sonographer,
  symptomsOrDiagnosis,
  withAdmitDate
} from './billing-sheet.formDefinition';

/**
 * Helper function to create a readonly version of ACNumber field
 */
export const createReadonlyACNumber = () => {
  return InputTextFields.TEXT({
    ...ACNumber,
    readonly: true,
  });
};

/**
 * Helper function to create an editable version of ACNumber field
 */
export const createEditableACNumber = () => {
  return InputTextFields.TEXT({
    ...ACNumber,
    readonly: false,
  });
};

/**
 * Helper function to create form definitions for CREATE context
 */
export const createBillingSheetFormDefinition = () => {
  return {
    consecutiveNumber,
    ACNumber: createEditableACNumber(),
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
  };
};

/**
 * Helper function to create form definitions for EDIT context
 */
export const createEditBillingSheetFormDefinition = () => {
  return {
    consecutiveNumber,
    ACNumber: createEditableACNumber(),
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
  };
};

/**
 * Helper function to create form definitions for PRINT context
 */
export const createPrintBillingSheetFormDefinition = () => {
  return {
    consecutiveNumber,
    ACNumber: createReadonlyACNumber(),
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
  };
};
