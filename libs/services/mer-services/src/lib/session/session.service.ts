import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { PublicRouteConstants } from '@mer-ui/common';
import { LoggedUserInfo } from '@mer/types';
import { SESSION_KEYS, SessionKey } from './session-keys';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly router = inject(Router);
  private readonly publicRouteConstants = PublicRouteConstants;
  // Señal reactiva para el estado de login
  public readonly userSessionData: WritableSignal<LoggedUserInfo> = signal(
    {
      technicianFirstName: null,
      technicianLastName: null,
      technicianCode: '',
      isLoggedIn: false,
    }
  );

  constructor() {
    // Sincroniza la señal con el SessionStorage al inicializar
    const stored = this.getSessionItem<LoggedUserInfo>(SESSION_KEYS.USER_DATA);
    if (stored !== null) {
      this.userSessionData.set(stored);
    }
  }

  /**
   * Guarda un valor (serializado como JSON) en SessionStorage
   */
  private setSessionItem<T>(key: SessionKey, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Obtiene y deserializa un valor de SessionStorage
   */
  private getSessionItem<T>(key: SessionKey): T | null {
    const item = sessionStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  /**
   * Elimina un valor de SessionStorage
   */
  private removeSessionItem(key: SessionKey): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Marca el login como exitoso y actualiza la señal y el SessionStorage
   */
  public setLoginSuccess(data: LoggedUserInfo): void {
    this.setSessionItem(SESSION_KEYS.USER_DATA, data);
    this.userSessionData.set(data);
  }

  /**
   * Marca el logout y actualiza la señal y el SessionStorage
   */
  public logout(): void {
    const resetData: LoggedUserInfo = {
      technicianFirstName: null,
      technicianLastName: null,
      technicianCode: '',
      isLoggedIn: false,
    };
    this.setSessionItem(SESSION_KEYS.USER_DATA, resetData);
    this.userSessionData.set(resetData);

    this.removeSessionItem(SESSION_KEYS.USER_DATA);

    this.router.navigate([this.publicRouteConstants.LOGIN]);
  }
}
