import { app, BrowserWindow } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join } from 'path';

import path from 'node:path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure Single Instance Lock
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(
  process.env.APP_ROOT,
  'dist/apps/frontend-electron'
);
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'frontend');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send(
      'main-process-message',
      new Date().toLocaleString()
    );
  });

  // In development, use the host url
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(VITE_DEV_SERVER_URL ?? 'http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from dist
    mainWindow.loadFile(join(RENDERER_DIST, 'index.html'));
  }

  return mainWindow;
}

// Someone tried to run a second instance, we should focus our window instead
app.on('second-instance', () => {
  if (win) {
    // Focus the main window if attempt was made to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    win = createWindow();
  }
});

app.whenReady().then(() => {
  win = createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow();
    }
  });
});
