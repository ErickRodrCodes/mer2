import { AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextFields } from '@mer-ui/ui-input-text-field';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Async validator function to check if a technician code already exists
function uniqueCodeValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  // Skip validation if the control value is empty
  if (!control.value) {
    return from(Promise.resolve(null));
  }

  // Convert the Promise to an Observable properly using from()
  return from(window.MedicalRecordAPI.isTechnicianCodeInDB(control.value)).pipe(
    map((result) => {
      // If result is true, the code exists (not unique), so return validation error
      // If result is false, the code is unique, so return null (valid)
      return result ? { uniqueCode: true } : null;
    })
  );
}

export const code_validation = InputTextFields.TEXT({
  name: 'code',
  label: 'Technician code',
  type: 'text',
  forceUpperCase: true,
  inlineValidation: true,
  placeholder: '',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Username is required',
    },
    minlength: {
      value: 6,
      message: '⚠️ Technician code require a minimum of 6 characters',
    },
    // Add async validators to check if code is unique
    asyncValidators: [
      {
        value: 'uniqueCode',
        validator: uniqueCodeValidator,
        message: '⚠️ This technician code is already in use',
      },
    ],
  },
});

export const firstname_validation = InputTextFields.TEXT({
  name: 'firstname',
  label: 'First Name',
  type: 'text',
  forceUpperCase: true,
  inlineValidation: true,
  placeholder: '',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ First name is required',
    },
    minlength: {
      value: 2,
      message: '⚠️ First Name must be at least 2 characters long',
    },
    maxlength: {
      value: 50,
      message: '⚠️ Maximum length is 50 characters',
    },
  },
});

export const lastname_validation = InputTextFields.TEXT({
  name: 'lastname',
  label: 'Last Name',
  type: 'text',
  forceUpperCase: true,
  inlineValidation: true,
  placeholder: '',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Last name is required',
    },
    maxlength: {
      value: 50,
      message: '⚠️ Maximum length is 50 characters',
    },
    minlength: {
      value: 2,
      message: '⚠️ Minimum length is 2 characters',
    },
  },
});

export const password_validation = InputTextFields.TEXT({
  name: 'password',
  label: 'Password (visible only on registration)',
  type: 'text',
  forceUpperCase: false,
  inlineValidation: true,
  placeholder: '',
  validationRules: {
    required: {
      value: true,
      message: 'Password is Required',
    },
    maxlength: {
      value: 16,
      message: 'Maximum length is 16 characters',
    },
    minlength: {
      value: 8,
      message: 'Minimum length is 8 characters',
    },
  },
});
