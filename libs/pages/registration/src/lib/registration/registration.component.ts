import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PublicRouteConstants } from '@mer-ui/common';
import { MerUIInputTextFieldComponent } from '@mer-ui/ui-input-text-field';
import {
  code_validation,
  firstname_validation,
  lastname_validation,
  password_validation,
} from './registration.formDefinition';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IpcMainService } from '@mer/services';

@Component({
  imports: [
    CommonModule,
    MerUIInputTextFieldComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  providers: [IpcMainService],
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class MerPagesRegistrationComponent implements OnInit {
  public readonly publicRouteConstants = PublicRouteConstants;

  public readonly formBuilder = inject(FormBuilder);
  public readonly router = inject(Router);
  public readonly containerRef = inject(ViewContainerRef);
  public readonly stateDialog: WritableSignal<boolean> = signal(false);
  public readonly destroyRef = inject(DestroyRef);

  public readonly code_validation = code_validation;
  public readonly firstname_validation = firstname_validation;
  public readonly lastname_validation = lastname_validation;
  public readonly password_validation = password_validation;

  public form = this.formBuilder.group({});

  public ipcMainService = inject(IpcMainService);

  public async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // Force the form itself to check validation
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    if (this.form.valid) {
      const formData = this.form.value as {
        firstname: string;
        lastname: string;
        code: string;
        password: string;
      };
      const response = await this.ipcMainService.addNewTechnician({
        technicianFirstName: formData.firstname,
        technicianLastName: formData.lastname,
        PK_techicianId: formData.code,
        password: formData.password,
      });

      if (response) {
        this.stateDialog.set(true);
      }
    }
  }
  openDialog(): void {
    this.stateDialog.set(true);
  }

  ngOnInit(): void {
    this.form.events
      .pipe(
        takeUntilDestroyed(this.destroyRef) // Automatically unsubscribe when the component is destroyed
      )
      .subscribe((event) => {
        console.log('Form event:', event);
      });
  }

  redirectToLogin(): void {
    this.router.navigate([this.publicRouteConstants.LOGIN]);
  }
}
