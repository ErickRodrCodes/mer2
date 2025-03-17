import { Route } from '@angular/router';

export type MenuItemRoute = {
  label?: string;
  icon?: string;
  order?: number;
  isPrivate?: boolean;
  hide?: boolean;
} & Route;

export interface LoggedUserInfo {
  technicianFirstName: string | null,
  technicianLastName: string | null,
  technicianCode: string,
  isLoggedIn: boolean,
}

export type CptSelection = {
  PK_cptcode: string;
  selectedOptions: string[];
};