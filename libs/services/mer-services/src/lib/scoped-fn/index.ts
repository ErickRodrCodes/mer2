export async function scopedIsTechnicianCodeInDB(value: string) {
  return await window.MedicalRecordAPI.isTechnicianCodeInDB(value);
}
