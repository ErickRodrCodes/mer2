// Declaration of preload-exposed IPC APIs available in the renderer process
// NOTE: Keep only type-level information; no runtime code or Electron imports.

// You can refine these signatures later. For ahora usamos `any` para destrabar el build.
export interface TMedicalReportAPI {
  // Database & medical-record related methods (subset)
  getListCPTCodes(): Promise<any[]>;
  getTechnicianNameByCode(code: string): Promise<{
    technicianFirstName: string;
    technicianLastName: string;
  }[]>;
  getListsOfIntakesOfDay(params: any): Promise<any>;
  intakeFormObtainNewPK(code: string): Promise<string>;
  intakeFormObtainNewPK_Intake(): Promise<string>;
  recordIntakeForm(params: any): Promise<any>;
  updateIntakeForm(params: any): Promise<any>;
  getFormById(params: any): Promise<any>;
  addNewTechnician(params: any): Promise<any>;
  loginTechnician(params: any): Promise<any>;
  isTechnicianCodeInDB(code: string): Promise<boolean>;
  getFacilitiesByString(params: any): Promise<any>;
  getPatientByCombinedKey(params: any): Promise<any>;
  getRightTodayDate(): Promise<number>;
  // Métodos adicionales pueden añadirse aquí…
  [key: string]: any;
}

export interface TPrinterPdfAPI {
  printDailyLog(params: any): Promise<void>;
  billingSheetPrint(params: any): Promise<void>;
  // …otros métodos
  [key: string]: any;
}

declare global {
  interface Window {
    MedicalRecordAPI: TMedicalReportAPI;
    PrinterPdfAPI: TPrinterPdfAPI;
  }
}

export { };

