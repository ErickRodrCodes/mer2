// Technicians table
const createTechniciansTable = `
CREATE TABLE IF NOT EXISTS technicians (
  PK_techicianId TEXT PRIMARY KEY,
  technicianFirstName TEXT NOT NULL,
  technicianLastName TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Patients table
const createPatientsTable = `
CREATE TABLE IF NOT EXISTS patients (
  PK_Patient TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  dateOfBirth TEXT NOT NULL,
  sex TEXT CHECK(sex IN ('male', 'female', 'other')) NOT NULL,
  identification TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  medicareNumber TEXT,
  primareInsurance TEXT,
  prinmaryInsurancePolicyNumber TEXT,
  secondaryInsurance TEXT,
  secondaryInsurancePolicyNumber TEXT,
  authorizationNumber TEXT,
  groupNumber TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Facilities table
const createFacilitiesTable = `
CREATE TABLE IF NOT EXISTS facilities (
  PK_facility TEXT PRIMARY KEY,
  facilityName TEXT NOT NULL,
  facilityAddress TEXT,
  facilityCity TEXT,
  facilityState TEXT,
  facilityZipcode TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// CPT Codes table
const createCPTCodesTable = `
CREATE TABLE IF NOT EXISTS cpt_codes (
  PK_cptcode TEXT PRIMARY KEY,
  id INTEGER NOT NULL,
  abbreviation TEXT NOT NULL,
  type TEXT CHECK(type IN ('CPT', 'TEXT')) NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  value TEXT, -- Only used for unknown codes
  options TEXT, -- JSON string for options
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Intake Forms table
const createIntakeFormsTable = `
CREATE TABLE IF NOT EXISTS intake_forms (
  PK_Intake TEXT PRIMARY KEY,
  acNumber TEXT,
  sonographer TEXT,
  faxNumber TEXT,
  dateOfService TEXT NOT NULL,
  amountToBePaid TEXT,
  checkNumber TEXT,
  cash TEXT,
  creditCard TEXT,
  facilityLocationType TEXT,
  facilityName TEXT,
  facilityAddress TEXT,
  facilityCity TEXT,
  facilityState TEXT,
  facilityZipcode TEXT,
  withAdmitDate TEXT,
  identification TEXT,
  patientMedicareNumber TEXT,
  patientFirstName TEXT,
  patientLasttName TEXT,
  patientDOB TEXT,
  patientSex TEXT,
  primaryInsurance TEXT,
  primaryInsurancePolicyNumber TEXT,
  secondaryInsurance TEXT,
  secondaryInsurancePolicyNumber TEXT,
  authorizationNumber TEXT,
  groupNumber TEXT,
  orderingPhysician TEXT,
  symptomsOrDiagnosis TEXT,
  cptText TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Junction table for Intake Forms and CPT Codes
const createIntakeFormCPTCodesTable = `
CREATE TABLE IF NOT EXISTS intake_form_cpt_codes (
  PK_intake_cpt  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  PK_Intake TEXT,
  PK_cptcode TEXT,
  code_order INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (PK_Intake) REFERENCES intake_forms(PK_Intake) ON DELETE CASCADE,
  FOREIGN KEY (PK_cptcode) REFERENCES cpt_codes(PK_cptcode) ON DELETE RESTRICT
);
`;

const createIntakeFormFacilitiesTable = `
CREATE TABLE IF NOT EXISTS intake_form_facilities (
	PK_intake_form_facilities INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	PK_Intake TEXT,
	PK_facility TEXT,
	CONSTRAINT FK_Intake FOREIGN KEY (PK_Intake) REFERENCES intake_forms(PK_Intake),
	CONSTRAINT FK_facility FOREIGN KEY (PK_facility) REFERENCES facilities(PK_facility)
);
`;

const createIntakleFormPatientTable = `
CREATE TABLE IF NOT EXISTS intake_form_patient (
	PK_intake_form_patient INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	PK_Intake TEXT,
	PK_Patient TEXT,
	CONSTRAINT intake_form_patient_intake_forms_FK FOREIGN KEY (PK_Intake) REFERENCES intake_forms(PK_Intake),
	CONSTRAINT intake_form_patient_patients_FK FOREIGN KEY (PK_Patient) REFERENCES patients(PK_Patient)
);
`;

// Export all creation queries
export const tableCreationQueries = {
  createTechniciansTable,
  createPatientsTable,
  createFacilitiesTable,
  createCPTCodesTable,
  createIntakeFormsTable,
  createIntakeFormCPTCodesTable,
  createIntakeFormFacilitiesTable,
  createIntakleFormPatientTable
};

// Example usage:
//addColumn('patients', 'new_field', 'TEXT')
