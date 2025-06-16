import { TMedicalReportAPI } from '../../preload/medicalRecords';
import { TPrinterPdfAPI } from '../../preload/printerpdf';
declare global {
  interface Window {
    MedicalRecordAPI: TMedicalReportAPI;
    PrinterPdfAPI: TPrinterPdfAPI;
  }
}

export { };


