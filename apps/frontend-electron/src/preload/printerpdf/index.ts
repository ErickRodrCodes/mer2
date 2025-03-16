import { contextBridge } from "electron";
import { createIpcRendererProxyFor } from "../../main/lib";
import { with_PDF_AllowedMethodNames } from "../../main/printerpdf/allowed-keys";
import { PrinterPdf } from "../../main/printerpdf/printerPdf";

const pdfPrintMethods = createIpcRendererProxyFor<PrinterPdf>(with_PDF_AllowedMethodNames);


//add here additional methods
const additionalMethods: Record<string, () => void> = {};

const completeAPI = {
  ...pdfPrintMethods,
  ...additionalMethods,
};

export const PrinterPdfAPI = contextBridge.exposeInMainWorld('PrinterPdfAPI', completeAPI);

export type TPrinterPdfAPI = typeof completeAPI;

// Export for backward compatibility
export const PrinterPdfAPIMethods = completeAPI;
