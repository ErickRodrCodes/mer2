import { app, BrowserWindow, globalShortcut } from 'electron';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { join } from 'path';
import './icpmain';
import { logger } from './logger';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure Single Instance Lock
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Set the correct APP_ROOT
process.env['APP_ROOT'] = path.resolve(__dirname, '../..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env['APP_ROOT'], 'apps/frontend-electron');
export const RENDERER_DIST = path.join(process.env['APP_ROOT'], 'apps/frontend');
export const PREALOAD_PATH = path.join(__dirname, 'preload.js')

logger.info(process.env['VITE_DEV_SERVER_URL']);
logger.info(process.env['APP_ROOT']);

process.env['VITE_PUBLIC'] = VITE_DEV_SERVER_URL
  ? path.join(process.env['APP_ROOT'], 'apps/frontend-electron/public')
  : path.join(RENDERER_DIST, 'public');

if (!process.env['VITE_PUBLIC']) {
  throw new Error('VITE_PUBLIC environment variable is not set');
}

let win: BrowserWindow | null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env['VITE_PUBLIC'] ?? '', 'electron-vite.svg'),
    webPreferences: {
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
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
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

app.on('browser-window-focus', function () {
  if(!process.env['VITE_DEV_SERVER_URL']){
    globalShortcut.register("CommandOrControl+R", () => {
        console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register("F5", () => {
        console.log("F5 is pressed: Shortcut Disabled");
    });
  }
});
app.on('browser-window-blur', function () {
  if(!process.env['VITE_DEV_SERVER_URL']){
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
  }
});
