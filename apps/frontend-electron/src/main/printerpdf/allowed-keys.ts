import type { PublicMethodNamesOf } from '../../types/lib';
import { PrinterPdf } from './printerPdf';

export type PDFMethodName = Extract<PublicMethodNamesOf<PrinterPdf>, string>;

export const with_PDF_AllowedMethodNames: readonly PDFMethodName[] = [
  'printDailyLog',
  'billingSheetPrint',
] as const;
