export * from './lib/electron-api-types';

// Side-effect import to ensure global Window augmentation is included
export type { TMedicalReportAPI, TPrinterPdfAPI } from './window';

