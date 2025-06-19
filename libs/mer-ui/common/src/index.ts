// Inline re-export to avoid TypeScript project-reference issues during Electron build.
export class PublicRouteConstants {
  public static readonly ROOT = '';
  public static readonly LOGIN = '/login';
  public static readonly REGISTER = '/register';
  public static readonly PRINT_BILLING_SHEET = '/print-billing-sheet/:billing_sheet_id';
  public static readonly PRINT_DAILY_REPORT = '/print-daily-report/:date/:technician_id';
}

export class ProtectedRouteConstants {
  public static readonly ROOT = '';
  public static readonly DASHBOARD = '/dashboard';
  public static readonly RECORD_BILLING_SHEET = '/record-billing-sheet';
  public static readonly EDIT_BILLING_SHEET = '/edit-billing-sheet/:billing_sheet_id';
  public static readonly DAILY_REPORT = '/daily-report';
  public static readonly PREVIEW_BILLING_SHEET = '/preview-billing-sheet/:billing_sheet_id';
}

// Export billing sheet form definitions
export * from './lib/form-definitions/billing-sheet.formDefinition';
export * from './lib/form-definitions/billing-sheet.helpers';

