import { registerIpcMainHandlers } from "../lib";
import { with_PDF_AllowedMethodNames } from "../printerpdf/allowed-keys";
import { PrinterPdf } from "../printerpdf/printerPdf";

const pdfPrinter = new PrinterPdf();

registerIpcMainHandlers(pdfPrinter, with_PDF_AllowedMethodNames);

//add here additional ipcMain handlers
const extraMethods: Record<string, () => void> = {};

const pdfClassInstanceMethods: Record<string, () => void> = {
  ...extraMethods,
}

for (const method of Object.keys(pdfClassInstanceMethods)) {
  pdfClassInstanceMethods[method]();
}

export default pdfClassInstanceMethods;
