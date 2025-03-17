import { ipcMain } from 'electron';
import { DB } from '../data-layer/db';
import { with_DB_AllowedMethodNames } from '../data-layer/db-allowed-keys';
import { registerIpcMainHandlers } from '../lib';

const db = new DB();

registerIpcMainHandlers(db, with_DB_AllowedMethodNames);

const extraMethods: Record<string, () => void> = {
  getIntakesByDateToPDF() {
    return ipcMain.handle('getIntakesByDateToPDF', async (_, technicianId: string, date: string) => {
      return { technicianId, date, success: true };
    });
  }
}

const ipcMainExec: Record<string, () => void> = {
  ...extraMethods,
}

for (const method of Object.keys(ipcMainExec) as Array<keyof typeof ipcMainExec>) {
  ipcMainExec[method]();
}

export default ipcMainExec;


