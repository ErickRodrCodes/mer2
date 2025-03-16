import { contextBridge, ipcRenderer } from 'electron';
import { DB } from '../../main/data-layer/db';
import { with_DB_AllowedMethodNames } from '../../main/data-layer/db-allowed-keys';
import { createIpcRendererProxyFor } from '../../main/lib';



const dbMethods = createIpcRendererProxyFor<DB>(with_DB_AllowedMethodNames);

// Additional methods that are not in the DB class and are used to extend the API
// for example, getting the list of intakes by date to PDF
const additionalMethods = {
  async getIntakesByDateToPDF(params: { technicianId: string; date: string }) {
    return await ipcRenderer.invoke('getIntakesByDateToPDF', params);
  },
};

// Combine the API
const completeAPI = {
  ...dbMethods,
  ...additionalMethods,
};

export const MedicalRecordAPI = contextBridge.exposeInMainWorld(
  'MedicalRecordAPI',
  completeAPI
);

export type TMedicalReportAPI = typeof completeAPI;

// Export for backward compatibility
export const MedicalRecordAPIMethods = completeAPI;
