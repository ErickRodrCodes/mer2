import { format } from 'date-fns';
import { app, BrowserWindow, shell } from 'electron';
import * as fs from 'fs';
import path from 'path';
import { PublicRouteConstants } from '../lib/constants';
import { logger } from '../logger';
import { PREALOAD_PATH, RENDERER_DIST, VITE_DEV_SERVER_URL } from '../main';

/**
 * Utility class for generating and printing PDF reports in the Electron app.
 * Handles creation of daily logs and billing sheets as PDF files, saving them to disk, and opening them automatically.
 */
export class PrinterPdf {
  constructor(){
    logger.info('PrinterPdf initialized');
  }
  private readonly debug = process.env['VITE_DEV_SERVER_URL'] ? true : false;
  /**
   * Generates and prints a daily log PDF for a technician on a specific date.
   * The PDF is saved in the user's Documents/daily-reports/{date}/ directory.
   *
   * @param params - Object containing the date and technician code.
   * @param params.date - The date for the daily log (format: yyyy-MM-dd).
   * @param params.techCode - The technician's code.
   */
  public printDailyLog(params: { date: string; techCode: string }) {
    const hashUrl = `#${PublicRouteConstants.PRINT_DAILY_REPORT}`.replace(':date', params.date).replace(':technician_id', params.techCode);

    const baseDir = 'daily-reports';
    const dateDir = format(new Date(), 'yyyy-MM-dd');
    const fileName = `LOG_${params.date}-${params.techCode}.pdf`;
    this._printPdf(hashUrl, baseDir, dateDir, fileName);
  }

  /**
   * Generates and prints a billing sheet PDF for a specific intake.
   * The PDF is saved in the user's Documents/billing-sheets/{date}/ directory.
   *
   * @param params - Object containing the intake primary key.
   * @param params.PK_Intake - The primary key of the intake.
   */
  public billingSheetPrint(params: { PK_Intake: string }) {
    const { PK_Intake } = params;
    const hashUrl = `#${PublicRouteConstants.PRINT_BILLING_SHEET}`.replace(':billing_sheet_id', PK_Intake);
    const baseDir = 'billing-sheets';
    const dateDir = format(new Date(), 'yyyy-MM-dd');
    const fileName = `${PK_Intake}.pdf`;
    this._printPdf(hashUrl, baseDir, dateDir, fileName);
  }

  /**
   * Internal method to handle the PDF generation and printing process.
   * Loads the appropriate route in a hidden Electron BrowserWindow, prints to PDF, saves the file, and opens it.
   *
   * @param hashUrl - The hash URL to load in the renderer for printing.
   * @param baseDir - The base directory for saving the PDF (e.g., 'daily-reports').
   * @param dateDir - The date-based subdirectory for organizing PDFs.
   * @param fileName - The name of the PDF file to save.
   */
  private _printPdf(
    hashUrl: string,
    baseDir: string,
    dateDir: string,
    fileName: string
  ): void {
    let printWindow: BrowserWindow | null = new BrowserWindow({
      width: 400,
      height: 600,
      webPreferences: {
        preload: PREALOAD_PATH,
      },
      show: this.debug,
    });

    const pdfConfig = {
      landscape: true,
      scale: 0.7,
      printBackground: true,
    };

    if (VITE_DEV_SERVER_URL) {
      printWindow.loadURL(`${VITE_DEV_SERVER_URL}${hashUrl}`);
    } else {
      printWindow.loadFile(path.join(RENDERER_DIST, 'index.html'), {
        hash: hashUrl,
      });
    }

    printWindow.webContents.on('did-finish-load', () => {
      let targetDir = path.join(app.getPath('documents'), baseDir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }
      targetDir = path.join(app.getPath('documents'), baseDir, dateDir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }
      const pathFile = path.join(targetDir, fileName);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }
      setTimeout(() => {
        printWindow?.webContents.printToPDF(pdfConfig).then((data) => {
          fs.writeFile(pathFile, new Uint8Array(data), (error) => {
            if (error) {
              console.log(`failed to write file on ${pathFile}`, error);
              throw new Error('failed to write file');
            } else {
              shell.openPath(pathFile);

              // don't close the window in debug mode
              if (!this.debug) {
                printWindow?.webContents.close();
              }
            }
          });
        });
      }, 1000);
    });

    printWindow.on('close', () => {
      printWindow = null;
    });
  }
}

export default PrinterPdf;
