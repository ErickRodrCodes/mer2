import { InputTextFields } from '@mer-ui/ui-input-text-field';

export const username_validation = InputTextFields.TEXT({
  name: 'technicianCode',
  label: 'Username',
  type: 'text',
  forceUpperCase: true,
  inlineValidation: false,
  placeholder: 'Enter your username',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Username is required',
    },
    minlength: {
      value: 6,
      message: '⚠️ Username must be at least 6 characters long',
    },
  },
});

export const password_validation = InputTextFields.TEXT({
  name: 'password',
  label: 'Password',
  type: 'password',
  inlineValidation: false,
  placeholder: 'Enter your password',
  validationRules: {
    required: {
      value: true,
      message: '⚠️ Password is Required',
    },
    maxlength: {
      value: 16,
      message: '⚠️ Maximum length is 16 characters',
    },
    minlength: {
      value: 8,
      message: '⚠️ Minimum length is 8 characters',
    },
  },
});
