import { InputTextFields } from '@mer-ui/ui-input-text-field';
import { RadioPillControlType } from '@mer-ui/ui-radio-group';

// TODO: Implement facilityLocationOption using HlmRadioGroupComponent
// Options: ALF, Hospital, Home, Prison/Jail, Office, Nursing Home
// Type: RadioPillControlType
// Required: true

// TODO: Implement patientSex using HlmRadioGroupComponent
// Options: Male, Female, Other
// Type: RadioPillControlType
// Required: true

export const consecutiveNumber = InputTextFields.TEXT({
  name: 'PK_Intake',
  label: 'A/C #',
  type: 'text',
  hidden: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Account number is required',
    },
  },
});

export const ACNumber = InputTextFields.TEXT({
  name: 'acNumber',
  label: 'A/C #',
  type: 'text',
  readonly: false,
  forceUpperCase: true,
  validationRules: {
    required: {
      value: false,
      message: '⚠️ Account number is required',
    },
  },
});

export const sonographer = InputTextFields.TEXT({
  name: 'sonographer',
  label: 'Sonographer',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Sonographer is required',
    },
  },
});

export const faxNumber = InputTextFields.TEXT({
  name: 'faxNumber',
  label: 'Fax Number',
  type: 'text',
  placeholder: 'Format: 111-222-3333',
  validationRules: {
    pattern: {
      value: /^\d{3}-\d{3}-\d{4}$/,
      message: '⚠️ Please enter a valid fax number (e.g., 111-222-3333)',
    },
  },
});

export const dateOfService = InputTextFields.TEXT({
  name: 'dateOfService',
  label: 'Date of service',
  type: 'date',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Date of service is required',
    },
  },
});

export const amountToBePaid = InputTextFields.NUMBER({
  name: 'amountToBePaid',
  label: 'Amount to be paid',
  validationRules: {
    required: {
      value: false,
      message: '⚠️ Amount is required',
    },
    min: {
      value: 0,
      message: '⚠️ Amount must be greater than 0',
    },
  },
});

export const checkNumber = InputTextFields.TEXT({
  name: 'checkNumber',
  label: 'Check Number',
  type: 'text',
});

export const cash = InputTextFields.NUMBER({
  name: 'cash',
  label: 'Cash',
  validationRules: {
    min: {
      value: 0,
      message: '⚠️ Amount must be greater than 0',
    },
  },
});

export const creditCard = InputTextFields.TEXT({
  name: 'creditCard',
  label: 'Credit Card',
  type: 'text',
});

export const facilityName = InputTextFields.TEXT({
  name: 'facilityName',
  label: 'Facility Name',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Facility name is required',
    },
  },
});

export const facilityAddress = InputTextFields.TEXT({
  name: 'facilityAddress',
  label: 'Facility Address',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Facility address is required',
    },
  },
});

export const facilityCity = InputTextFields.TEXT({
  name: 'facilityCity',
  label: 'Facility City',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Facility city is required',
    },
  },
});

export const facilityState = InputTextFields.TEXT({
  name: 'facilityState',
  label: 'Facility State',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Facility state is required',
    },
  },
});

export const facilityZipcode = InputTextFields.TEXT({
  name: 'facilityZipcode',
  label: 'Facility Zipcode',
  type: 'text',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Facility zipcode is required',
    },
    pattern: {
      value: /^\d{5}(-\d{4})?$/,
      message: '⚠️ Please enter a valid zipcode (e.g., 12345 or 12345-6789)',
    },
  },
});

export const withAdmitDate = InputTextFields.TEXT({
  name: 'withAdmitDate',
  label: 'Patient Admition Date',
  type: 'date',
});

export const identification = InputTextFields.TEXT({
  name: 'identification',
  label: 'Identification (Room Number/Inmate ID)',
  type: 'text',
  forceUpperCase: true,
});

export const patientMedicareNumber = InputTextFields.TEXT({
  name: 'patientMedicareNumber',
  label: 'Patient Medicare Number',
  type: 'text',
  forceUpperCase: true,
});

export const patientFirstName = InputTextFields.TEXT({
  name: 'patientFirstName',
  label: 'Patient First Name',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Patient first name is required',
    },
  },
});

export const patientLasttName = InputTextFields.TEXT({
  name: 'patientLasttName',
  label: 'Patient Last Name',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Patient last name is required',
    },
  },
});

export const patientDOB = InputTextFields.TEXT({
  name: 'patientDOB',
  label: 'Patient Date of Birth',
  type: 'date',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Patient date of birth is required',
    },
  },
});

export const primaryInsurance = InputTextFields.TEXT({
  name: 'primaryInsurance',
  label: 'Primary Insurance',
  type: 'text',
  forceUpperCase: true,
});

export const primaryInsurancePolicyNumber = InputTextFields.TEXT({
  name: 'primaryInsurancePolicyNumber',
  label: 'P.I. Policy Number',
  type: 'text',
  forceUpperCase: true,
});

export const secondaryInsurance = InputTextFields.TEXT({
  name: 'secondaryInsurance',
  label: 'Secondary Insurance',
  type: 'text',
  forceUpperCase: true,
});

export const secondaryInsurancePolicyNumber = InputTextFields.TEXT({
  name: 'secondaryInsurancePolicyNumber',
  label: 'S.I. Policy Number',
  type: 'text',
  forceUpperCase: true,
});

export const authorizationNumber = InputTextFields.TEXT({
  name: 'authorizationNumber',
  label: 'Authorization Number',
  type: 'text',
  forceUpperCase: true,
});

export const groupNumber = InputTextFields.TEXT({
  name: 'groupNumber',
  label: 'Group Number',
  type: 'text',
  forceUpperCase: true,
});

export const orderingPhysician = InputTextFields.TEXT({
  name: 'orderingPhysician',
  label: 'Ordering Physician',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Ordering physician is required',
    },
  },
});

export const symptomsOrDiagnosis = InputTextFields.TEXT({
  name: 'symptomsOrDiagnosis',
  label: 'Symptoms/Diagnosis',
  type: 'text',
  forceUpperCase: true,
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Symptoms/Diagnosis is required',
    },
  },
});

// TODO: Implement CptCodeSelect component
// Type: Dialog component for selecting CPT codes
// Features:
// - Searchable list of CPT codes
// - Multiple selection
// - Validation for required CPT codes
// - Integration with form validation

// TODO: Implement ListComponetsWithOptions component
// Type: List component for displaying selected CPT codes
// Features:
// - Display selected CPT codes with options
// - Remove/Edit options for each code
// - Validation state display

// TODO: Implement CPTTextForm component
// Type: Form component for CPT text details
// Features:
// - Text input for CPT description
// - Validation for required fields
// - Integration with form validation

/** place here the code for checkbox groups */
export const facilityLocationOption: RadioPillControlType = {
  name:'facilityLocationType',
  label: 'Type of Facility',
  layout: 'horizontal',
  validation: (value:string) => {
      return value.trim().length > 0 || 'At least one option is required'
  },
  options:[
    {
      id: 'ALF',
      label: 'ALF',
      value: 'ALF',
    },
    {
      id: 'Hospital',
      label: 'Hospital',
      value: 'Hospital',
    },
    {
      id: 'Home',
      label: 'Home',
      value: 'Home',
    },
    {
      id: 'PrisonJail',
      label: 'Prison/Jail',
      value: 'Prison/Jail',
    },
    {
      id: 'Office',
      label: 'Office',
      value: 'Office',
    },
    {
      id: 'NursingHome',
      label: 'Nursing Home',
      value: 'Nursing Home',
    },
  ]
}

export const patientSex: RadioPillControlType = {
  name:'patientSex',
  label: 'Patient Sex',
  validation: (value:string) => {
    return value.trim().length > 0 || 'At least one option is required'
  },
  options:[
    {
      id:'male',
      label:'Male',
      value:'Male',
    },
    {
      id:'female',
      label:'Female',
      value:'Female',
    },
    {
      id:'other',
      label:'Other',
      value:'Other',
    }
  ]
}
