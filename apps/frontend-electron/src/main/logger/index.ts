import { app, BrowserWindow, dialog } from 'electron';
import log from 'electron-log/main';
import * as fs from 'fs';
import * as path from 'path';
// Get the user data path for the application
const userDataPath = app.getPath('userData');

// Construct the full path for the log file
export const logFilePath = path.join(userDataPath, 'logs', 'combined.log');
console.log('logFilePath', logFilePath);

// Configure Winston logger
// export const logger = winston.createLogger({
//   level: 'info', // Set the logging level
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json() // Use JSON format or winston.format.simple()
//   ),
//   transports: [
//     new winston.transports.File({ filename: logFilePath }),
//     // Optionally add console transport
//     new winston.transports.Console(),
//   ],
// });

log.initialize()

export const logger = log;

export function setupLogger() {
  // Get the user data path for the application
  const userDataPath = app.getPath('userData');

  // Construct the full path for the log file
  const logFilePath = path.join(userDataPath, 'logs', 'main.log');

  // Ensure the logs directory exists
  const logsDir = path.dirname(logFilePath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  return log;
}

export const setupWindowLogger = (mainWindow: BrowserWindow) => {
  // Updated event listener for renderer process gone
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logger.error('Render process gone', {
      reason: details.reason,
      exitCode: details.exitCode,
    });

    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Application Error',
      message: 'The Renderer process was lost and cannot be restored. Please check the logs for more details:\n'+logFilePath,
    });
  });

  mainWindow.on('unresponsive', () => {
    logger.warn('Main window is unresponsive');
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'Application Warning',
      message: 'The Main process became unresponsive and the application became unstable.\n If the application cannot recover, please forcefullly close it with Windows Task Manager.\nPlease check the logs for more details:\n'+logFilePath,
    });
  });

  // Global error handling
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error });

    // Optionally show a dialog to the user
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Application Error',
      message: 'An uncaught exception occurred in the application. Please check the logs for more details:\n'+logFilePath,
    });
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });

    // Optionally show a dialog to the user
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Application Error',
      message: 'An unhandled promised rejection occuried in the application. please check the logs for more details:\n'+logFilePath,
    });
  });
};
