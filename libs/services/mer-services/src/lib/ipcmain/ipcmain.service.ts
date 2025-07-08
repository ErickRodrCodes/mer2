import { Injectable } from '@angular/core';
import type { TMedicalReportAPI, TPrinterPdfAPI } from 'electron-api-types';

declare global {
  interface Window {
    MedicalRecordAPI: TMedicalReportAPI;
    PrinterPdfAPI: TPrinterPdfAPI;
  }
}
@Injectable()
export class IpcMainService {
  public async getListCPTCodes(): Promise<any> {
    return await window.MedicalRecordAPI.getListCPTCodes();
  }

  public async loginTechnician(params: {
    technicianCode: string;
    password: string;
  }) {
    return await window.MedicalRecordAPI.loginTechnician(params);
  }

  public async isTechnicianCodeInDB(value: string) {
    return await window.MedicalRecordAPI.isTechnicianCodeInDB(value);
  }

  public async intakeFormObtainNewPK(code: string): Promise<string> {
    return await window.MedicalRecordAPI.intakeFormObtainNewPK(code);
  }

  public async intakeFormObtainNewPK_Intake(): Promise<string> {
    return await window.MedicalRecordAPI.intakeFormObtainNewPK_Intake();
  }

  public async getFacilitiesByString(value: string): Promise<any> {
    return await window.MedicalRecordAPI.getFacilitiesByString(value);
  }

  public async getPatientByCombinedKey(value: string): Promise<any> {
    return await window.MedicalRecordAPI.getPatientByCombinedKey(value);
  }

  public async recordIntakeForm(params: { intakeForm: any }): Promise<any> {
    return await window.MedicalRecordAPI.recordIntakeForm(params);
  }

  public async getFormById(params: { intakeId: string }): Promise<any> {
    return await window.MedicalRecordAPI.getFormById(params);
  }

  public async updateIntakeForm(params: { intakeForm: any }): Promise<any> {
    await window.MedicalRecordAPI.updateIntakeForm(params);
  }

  public async getTechnicianNameByCode(code: string) {
    return await window.MedicalRecordAPI.getTechnicianNameByCode(code);
  }

  public async getListsOfIntakesOfDay(params: {
    technicianId: string;
    date: string;
  }) {
    return await window.MedicalRecordAPI.getListsOfIntakesOfDay(params);
  }

  public async getRightTodayDate(): Promise<number> {
    return await window.MedicalRecordAPI.getRightTodayDate();
  }

  public async addNewTechnician(params: {
    technicianFirstName: string;
    technicianLastName: string;
    PK_techicianId: string;
    password: string;
  }) {
    return await window.MedicalRecordAPI.addNewTechnician(params);
  }

  public async billingSheetPrint(params: { PK_Intake: string }): Promise<void> {
    return await window.PrinterPdfAPI.billingSheetPrint(params);
  }

  public async printDailyLog(params: { techCode: string; date: string }) {
    return await window.PrinterPdfAPI.printDailyLog(params);
  }
}
