import { ProtectedRouteConstants, PublicRouteConstants } from '@mer-ui/common';
import { MenuItemRoute } from '@mer/types';

/**
 * removesd the initial slash of a route for routing purposes
 * @param route
 * @returns
 */
const formatRoute = (route: string) => {
  return route.replace('/', '');
};

export const commonRoutes: MenuItemRoute[] = [
  { path: '', redirectTo: PublicRouteConstants.LOGIN, pathMatch: 'full' },
  {
    label: 'Login',
    icon: 'home',
    order: 0,
    isPrivate: false,
    path: formatRoute(PublicRouteConstants.LOGIN),
    loadComponent: () =>
      import('@mer-pages/login').then((c) => c.MerPagesLoginComponent),
  },
  {
    label: 'Register',
    icon: 'register',
    order: 1,
    isPrivate: false,
    path: formatRoute(PublicRouteConstants.REGISTER),
    loadComponent: () =>
      import('@mer-pages/registration').then(
        (c) => c.MerPagesRegistrationComponent
      ),
  },
  {
    isPrivate: true,
    label: 'Dashboard',
    icon: 'dashboard',
    order: 2,
    path: formatRoute(ProtectedRouteConstants.DASHBOARD),
    loadComponent: () =>
      import('@mer-pages/dashboard').then((c) => c.MerPagesDashboardComponent),
  },
  {
    path: formatRoute(ProtectedRouteConstants.RECORD_BILLING_SHEET),
    loadComponent: () =>
      import('@mer-pages/billing-sheet-create').then(
        (c) => c.MerPagesBillingSheetCreateComponent
      ),
  },

  {
    path: formatRoute(ProtectedRouteConstants.DAILY_REPORT),
    loadComponent: () =>
      import('@mer-pages/daily-report-view').then(
        (c) => c.MerPagesDailyReportViewComponent
      ),
  },
  {
    path: formatRoute(PublicRouteConstants.PRINT_DAILY_REPORT),
    loadComponent: () =>
      import('@mer-pages/daily-report-print').then(
        (c) => c.MerPagesDailyReportPrintComponent
      ),
  },
  {
    path: formatRoute(PublicRouteConstants.PRINT_BILLING_SHEET),
    loadComponent: () =>
      import('@mer-pages/billing-sheet-print').then(
        (c) => c.MerPagesBillingSheetPrintComponent
      ),
  },
  {
    path: formatRoute(ProtectedRouteConstants.EDIT_BILLING_SHEET),
    loadComponent: () =>
      import('@mer-pages/billing-sheet-edit').then(
        (c) => c.MerPagesBillingSheetEditComponent
      ),
  },
];
