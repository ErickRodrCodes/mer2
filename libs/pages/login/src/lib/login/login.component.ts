import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProtectedRouteConstants, PublicRouteConstants } from '@mer-ui/common';
import { MerUIInputTextFieldComponent } from '@mer-ui/ui-input-text-field';
import { IpcMainService, SessionService } from '@mer/services';
import { LoggedUserInfo } from '@mer/types';
import {
  password_validation,
  username_validation,
} from './login.formDefinition';
@Component({
  selector: 'lib-mer-pages-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MerUIInputTextFieldComponent,
  ],
  providers: [IpcMainService],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class MerPagesLoginComponent {
  public readonly publicRouteConstants = PublicRouteConstants;
  public readonly protectedRouteConstants = ProtectedRouteConstants;
  private readonly router = inject(Router);
  public usernameField = username_validation;
  public passwordField = password_validation;
  public readonly formBuilder = inject(FormBuilder);
  public isWrongLogin = signal(false);
  private readonly sessionService = inject(SessionService);

  // Initialize form with empty controls that will be populated by the input fields
  public form = this.formBuilder.group({});

  public ipcMainService = inject(IpcMainService);
  constructor() {
    this.form.events.subscribe(() => {
      // let's ensure to remove the error message when the user starts typing
      this.isWrongLogin.set(false);
    });
  }

  public handleSubmit(event: Event): void {
    event.preventDefault();

    // Force the form itself to check validation
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    if (this.form.valid) {
      const formValue = this.form.value as {
        technicianCode: string;
        password: string;
      };
      console.log('Form is valid');

      this.ipcMainService
        .loginTechnician(formValue)
        .then((response: LoggedUserInfo) => {
          if (response.isLoggedIn) {
            // Guardar datos de login exitoso en el servicio de sesión
            this.sessionService.setLoginSuccess({
              ...response,
            });
            this.router.navigate([this.protectedRouteConstants.DASHBOARD]);
          } else {
            this.form.markAsTouched();
            this.isWrongLogin.set(true);
          }
        });
    }
  }
}
