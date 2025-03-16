import type { TMedicalReportAPI, TPrinterPdfAPI } from '@mer/electron-api';

declare global {
  interface Window {
    MedicalRecordAPI: TMedicalReportAPI;
    PrinterPdfAPI: TPrinterPdfAPI;
  }
}

export { };

