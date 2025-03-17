import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Interfaz para un criterio de validación con mensaje personalizado
 */
export interface ValidationCriteria<T> {
  value: T;
  message?: string;
}

/**
 * Definición de los tipos de input HTML soportados
 */
export const INPUT_TEXT_TYPES = [
  'text',
  'number',
  'email',
  'password',
  'tel',
  'date',
  'time',
  'url',
  'search',
  'color',
  'hidden',
] as const;

/**
 * Tipo para los tipos de input HTML soportados
 */
export type InputTextType = (typeof INPUT_TEXT_TYPES)[number];

/**
 * Valores constantes para los tipos de input
 */
export const InputTextTypes = {
  TEXT: 'text' as InputTextType,
  NUMBER: 'number' as InputTextType,
  EMAIL: 'email' as InputTextType,
  PASSWORD: 'password' as InputTextType,
  TEL: 'tel' as InputTextType,
  DATE: 'date' as InputTextType,
  TIME: 'time' as InputTextType,
  URL: 'url' as InputTextType,
  SEARCH: 'search' as InputTextType,
  COLOR: 'color' as InputTextType,
} as const;

export interface AsyncValidationCriteria<T> {
  value: T;
  message?: string;
  // Function that returns a Promise<ValidationErrors | null> or Observable<ValidationErrors | null>
  validator: (
    control: AbstractControl
  ) => Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

/**
 * Interfaz para las reglas de validación de un campo de texto
 */
export interface ValidationRules {
  required?: ValidationCriteria<boolean>;
  minlength?: ValidationCriteria<number>;
  maxlength?: ValidationCriteria<number>;
  pattern?: ValidationCriteria<RegExp>;
  min?: ValidationCriteria<number>;
  max?: ValidationCriteria<number>;
  asyncValidators?: AsyncValidationCriteria<any>[];
}

/**
 * Interfaz para definir un campo de tipo InputText
 */
export interface InputTextField {
  // Propiedades básicas
  name: string;
  label: string;
  id?: string;
  keyValue?: string;

  // Tipo y estilo
  type?: InputTextType;
  placeholder?: string;
  forceUpperCase?: boolean;

  // Estado
  disabled?: boolean;
  readonly?: boolean;
  inlineValidation?: boolean;

  // Validación
  validationRules?: ValidationRules;

  // Valor inicial
  defaultValue?: string;

  // Propiedades adicionales
  description?: string;
  order?: number;
  group?: string;
  customData?: Record<string, any>;
  hidden?: boolean;
}

/**
 * Catálogo de campos predefinidos
 */
export const InputTextFields = {
  /**
   * Campo de texto estándar
   */
  TEXT: (options: Partial<InputTextField> = {}): InputTextField => ({
    name: options.name || '',
    label: options.label || 'Texto',
    id: options.id || options.name || '',
    keyValue: options.keyValue || options.id || options.name || '',
    type: options.type || InputTextTypes.TEXT,
    placeholder: options.placeholder || '',
    forceUpperCase: options.forceUpperCase || false,
    ...options,
  }),

  /**
   * Campo de correo electrónico
   */
  EMAIL: (options: Partial<InputTextField> = {}): InputTextField => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return {
      name: options.name || '',
      label: options.label || 'Correo electrónico',
      id: options.id || options.name || '',
      keyValue: options.keyValue || options.id || options.name || '',
      type: options.type || InputTextTypes.EMAIL,
      placeholder: options.placeholder || 'ejemplo@dominio.com',
      forceUpperCase:
        options.forceUpperCase !== undefined ? options.forceUpperCase : false,
      validationRules: {
        ...(options.validationRules || {}),
        pattern:
          options.validationRules?.pattern ||
          createValidationCriteria(
            emailPattern,
            'Formato de correo electrónico inválido'
          ),
        required:
          options.validationRules?.required !== undefined
            ? options.validationRules.required
            : createValidationCriteria(
                true,
                'El correo electrónico es obligatorio'
              ),
      },
      ...options,
    };
  },

  /**
   * Campo numérico
   */
  NUMBER: (options: Partial<InputTextField> = {}): InputTextField => ({
    name: options.name || '',
    label: options.label || 'Number',
    id: options.id || options.name || '',
    keyValue: options.keyValue || options.id || options.name || '',
    type: options.type || InputTextTypes.NUMBER,
    placeholder: options.placeholder || 'Input a value',
    forceUpperCase:
      options.forceUpperCase !== undefined ? options.forceUpperCase : false,
    ...options,
  }),

  /**
   * Campo para nombres
   */
  NAME: (options: Partial<InputTextField> = {}): InputTextField => ({
    name: options.name || '',
    label: options.label || 'Name',
    id: options.id || options.name || '',
    keyValue: options.keyValue || options.id || options.name || '',
    type: options.type || InputTextTypes.TEXT,
    placeholder: options.placeholder || 'Input a name',
    forceUpperCase:
      options.forceUpperCase !== undefined ? options.forceUpperCase : true,
    validationRules: {
      ...(options.validationRules || {}),
      required:
        options.validationRules?.required !== undefined
          ? options.validationRules.required
          : createValidationCriteria(true, 'Name is required'),
      minlength:
        options.validationRules?.minlength !== undefined
          ? options.validationRules.minlength
          : createValidationCriteria(
              2,
              'Name must be at least 2 characters'
            ),
    },
    ...options,
  }),

  /**
   * Campo para documentos de identidad
   */
  DOCUMENT_ID: (options: Partial<InputTextField> = {}): InputTextField => ({
    name: options.name || '',
    label: options.label || 'Document ID',
    id: options.id || options.name || '',
    keyValue: options.keyValue || options.id || options.name || '',
    type: options.type || InputTextTypes.TEXT,
    placeholder: options.placeholder || 'Input a document',
    forceUpperCase:
      options.forceUpperCase !== undefined ? options.forceUpperCase : true,
    validationRules: {
      ...(options.validationRules || {}),
      required:
        options.validationRules?.required !== undefined
          ? options.validationRules.required
          : createValidationCriteria(
              true,
              'Document ID is required'
            ),
      minlength:
        options.validationRules?.minlength !== undefined
          ? options.validationRules.minlength
          : createValidationCriteria(
              5,
              'Document ID must be at least 5 characters'
            ),
      maxlength:
        options.validationRules?.maxlength !== undefined
          ? options.validationRules.maxlength
          : createValidationCriteria(
              20,
              'Document ID must not exceed 20 characters'
            ),
    },
    ...options,
  }),

  /**
   * Campo para teléfonos
   */
  PHONE: (options: Partial<InputTextField> = {}): InputTextField => ({
    name: options.name || '',
    label: options.label || 'Phone',
    id: options.id || options.name || '',
    keyValue: options.keyValue || options.id || options.name || '',
    type: options.type || InputTextTypes.TEL,
    placeholder: options.placeholder || 'Ej: +34 600000000',
    forceUpperCase:
      options.forceUpperCase !== undefined ? options.forceUpperCase : false,
    validationRules: {
      ...(options.validationRules || {}),
      required:
        options.validationRules?.required !== undefined
          ? options.validationRules.required
          : createValidationCriteria(true, 'Phone is required'),
      minlength:
        options.validationRules?.minlength !== undefined
          ? options.validationRules.minlength
          : createValidationCriteria(
              6,
              'Phone must be at least 6 characters'
            ),
    },
    ...options,
  }),
};

/**
 * Extrae el valor de un criterio de validación
 * @param rule Objeto ValidationCriteria
 * @returns El valor de la regla o undefined si no existe
 */
export function getValidationValue<T>(
  rule: ValidationCriteria<T> | undefined
): T | undefined {
  if (rule === undefined || rule === null) {
    return undefined;
  }

  return rule.value;
}

/**
 * Extrae el mensaje de un criterio de validación
 * @param rule Objeto ValidationCriteria
 * @returns El mensaje de error asociado o undefined
 */
export function getValidationMessage<T>(
  rule: ValidationCriteria<T> | undefined
): string | undefined {
  if (rule === undefined || rule === null) {
    return undefined;
  }

  return rule.message;
}

/**
 * Convierte un valor primitivo en un objeto ValidationCriteria
 * @param value Valor a convertir
 * @param message Mensaje opcional de error
 * @returns Objeto ValidationCriteria
 */
export function createValidationCriteria<T>(
  value: T,
  message?: string
): ValidationCriteria<T> {
  return { value, message };
}

/**
 * Genera un objeto con las propiedades para aplicar directamente al componente InputText.
 * @param field Definición del campo InputTextField
 * @returns Objeto con las propiedades formateadas para el componente
 */
export function getInputTextProps(field: InputTextField): Record<string, any> {
  // Convertir las reglas de validación para que sean compatibles con Angular
  const validationRules: Record<string, any> = {};

  if (field.validationRules) {
    // Procesar cada tipo de regla de validación
    // 1. Required
    const requiredRule = field.validationRules.required;
    if (requiredRule !== undefined) {
      validationRules['required'] = requiredRule.value;
      if (requiredRule.message) {
        validationRules['required_message'] = requiredRule.message;
      }
    }

    // 2. minlength
    const minlengthRule = field.validationRules.minlength;
    if (minlengthRule !== undefined) {
      validationRules['minlength'] = minlengthRule.value;
      if (minlengthRule.message) {
        validationRules['minlength_message'] = minlengthRule.message;
      }
    }

    // 3. maxlength
    const maxlengthRule = field.validationRules.maxlength;
    if (maxlengthRule !== undefined) {
      validationRules['maxlength'] = maxlengthRule.value;
      if (maxlengthRule.message) {
        validationRules['maxlength_message'] = maxlengthRule.message;
      }
    }

    // 4. pattern
    const patternRule = field.validationRules.pattern;
    if (patternRule !== undefined) {
      validationRules['pattern'] = patternRule.value;
      if (patternRule.message) {
        validationRules['pattern_message'] = patternRule.message;
      }
    }

    // 5. min
    const minRule = field.validationRules.min;
    if (minRule !== undefined) {
      validationRules['min'] = minRule.value;
      if (minRule.message) {
        validationRules['min_message'] = minRule.message;
      }
    }

    // 6. max
    const maxRule = field.validationRules.max;
    if (maxRule !== undefined) {
      validationRules['max'] = maxRule.value;
      if (maxRule.message) {
        validationRules['max_message'] = maxRule.message;
      }
    }
  }

  return {
    id: field.id || field.name,
    name: field.name,
    label: field.label,
    placeholder: field.placeholder || '',
    type: field.type || 'text',
    readonly: field.readonly || false,
    forceUpperCase:
      field.forceUpperCase !== undefined ? field.forceUpperCase : true,
    validationRules,
    keyValue: field.keyValue || field.id || field.name,
    disabled: field.disabled || false,
    inlineValidation: field.inlineValidation || false,
  };
}

/**
 * Crea una configuración de campo a partir de datos parciales,
 * usando valores predeterminados para propiedades no especificadas.
 * @param options Opciones parciales para la configuración del campo
 * @returns Configuración completa del campo
 */
export function createInputTextField(
  options: Partial<InputTextField>
): InputTextField {
  const type = options.type || 'text';

  // Determinar qué tipo de campo predefinido usar basado en el tipo
  switch (type) {
    case 'email':
      return InputTextFields.EMAIL(options);
    case 'number':
      return InputTextFields.NUMBER(options);
    case 'tel':
      return InputTextFields.PHONE(options);
    default:
      return InputTextFields.TEXT(options);
  }
}
