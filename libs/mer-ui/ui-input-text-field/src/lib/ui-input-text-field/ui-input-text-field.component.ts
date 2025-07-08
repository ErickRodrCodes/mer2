import {
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  AsyncValidatorFn,
  ControlContainer,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@spartan-ng/brain/forms';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

import { InputTextField, ValidationRules } from '../types/types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mer-input-text-field',
  imports: [ReactiveFormsModule, HlmFormFieldModule, HlmInputDirective],
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MerUIInputTextFieldComponent),
      multi: true,
    },
  ],
  standalone: true,
  templateUrl: './ui-input-text-field.component.html',
  styles: `
    :host{
      display:contents;
    }
  `,
})
export class MerUIInputTextFieldComponent implements OnInit {
  private controlContainer: ControlContainer | null = null;

  // Input signals
  public fieldDefinition = input.required<InputTextField>();
  public value = input<string | number | null>('');

  public readonly id = computed(() => this.fieldDefinition().name || '');
  public readonly label = computed(() => this.fieldDefinition().label || '');
  public readonly placeholder = computed(
    () => this.fieldDefinition().placeholder || ''
  );
  public readonly type = computed(() => this.fieldDefinition().type || 'text');

  public readonly readonly = computed(
    () => this.fieldDefinition().readonly || false
  );
  public readonly forceUpperCase = computed(
    () => this.fieldDefinition().forceUpperCase || false
  );
  public readonly validationRules = computed(
    () => this.fieldDefinition().validationRules || {}
  );
  public readonly keyValue = computed(
    () => this.fieldDefinition().keyValue || ''
  );
  public readonly inlineValidation = computed(
    () => this.fieldDefinition().inlineValidation || false
  );
  public readonly hidden = computed(
    () => this.fieldDefinition().hidden || false
  );

  public readonly fieldValue = signal<string | number>('');
  public readonly errorMessage = signal<string>('');

  public readonly hasError = signal(false);
  public readonly touched = signal(false);
  public readonly disabled = signal(false);

  public readonly inputControl: FormControl = new FormControl('');

  public readonly asyncValidationPending = signal(false);

  private readonly injector = inject(Injector);

  constructor() {
    // Setup form control and validators
    effect(() => {
      const { validators, asyncValidators } = this.transformValidationRules(
        this.validationRules()
      );
      this.inputControl.setValidators(validators);
      this.inputControl.setAsyncValidators(asyncValidators);
      this.inputControl.updateValueAndValidity();
    });

    effect(() => {
      this.asyncValidationPending.set(this.inputControl.pending);

      // Listen for status changes to update the pending state
      this.inputControl.statusChanges.subscribe((status) => {
        this.asyncValidationPending.set(this.inputControl.pending);

        // Once async validation completes, update error state if needed
        if (!this.inputControl.pending && this.inputControl.errors) {
          this.hasError.set(true);
          this.errorMessage.set(
            this.getErrorMessage(Object.keys(this.inputControl.errors)[0])
          );
        }
      });
    });

    try {
      this.controlContainer = this.injector.get(ControlContainer);
    } catch (error) {
      this.controlContainer = null;
    }
  }

  /**
   * Transforms ValidationRules to Angular ValidatorFn array
   */
  private transformValidationRules(rules?: ValidationRules): {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
  } {
    const validators: ValidatorFn[] = [];
    const asyncValidators: AsyncValidatorFn[] = [];

    if (!rules) return { validators, asyncValidators };

    // Synchronous validators
    if (rules.required?.value === true) {
      validators.push(Validators.required);
    }

    if (rules.minlength !== undefined) {
      validators.push(Validators.minLength(rules.minlength.value));
    }

    if (rules.maxlength !== undefined) {
      validators.push(Validators.maxLength(rules.maxlength.value));
    }

    if (rules.pattern !== undefined) {
      validators.push(Validators.pattern(rules.pattern.value));
    }

    if (rules.min !== undefined) {
      validators.push(Validators.min(rules.min.value));
    }

    if (rules.max !== undefined) {
      validators.push(Validators.max(rules.max.value));
    }

    // Async validators
    if (rules.asyncValidators && rules.asyncValidators.length > 0) {
      rules.asyncValidators.forEach((asyncValidator) => {
        asyncValidators.push(asyncValidator.validator);
      });
    }

    return { validators, asyncValidators };
  }

  public captureErrorState($event: {
    isError: boolean;
    errors: ValidationErrors | null | undefined;
  }): void {
    if ($event.isError) {
      this.hasError.set(true);
      this.inputControl.markAsDirty();
      this.errorMessage.set(
        this.getErrorMessage(Object.keys($event.errors || {})[0])
      );
    } else {
      this.hasError.set(false);
      this.errorMessage.set('');
      this.inputControl.markAllAsTouched();
    }
  }

  public getErrorMessage(errorKey: string | null): string {
    if (!errorKey) return '';
    const validationRules = this.validationRules();

    // For standard validators like required, minlength, min, max, etc.
    const keys = Object.keys(validationRules).map((key) => key.toLowerCase());
    if (keys.includes(errorKey.toLowerCase())) {
      // Type assertion to handle the different types of validation criteria
      const rule = validationRules[errorKey as keyof ValidationRules];

      // Handle each possible type
      if (rule && 'message' in rule) {
        return rule.message || '';
      } else if (
        Array.isArray(rule) &&
        rule.length > 0 &&
        'message' in rule[0]
      ) {
        // For array types like asyncValidators
        return rule[0].message || '';
      }
    }

    const findAsyncValidator = validationRules.asyncValidators?.find(
      (validator) => validator?.value === errorKey
    );
    if (findAsyncValidator) {
      return findAsyncValidator.message || '';
    }

    return '';
  }

  public onBlurEvent($event: FocusEvent): void {
    this.inputControl.markAsTouched();
    if (this.inputControl.errors) {
      this.inputControl.markAsDirty();
    }
  }

  public onChangeEvent($event: Event): void {
    if (this.forceUpperCase()) {
      this.inputControl.setValue(
        (<HTMLInputElement>$event.target).value.toUpperCase()
      );
    }
    this.inputControl.markAsDirty();
  }

  ngOnInit(): void {
    const fieldName = this.fieldDefinition().name;
    this.inputControl.setValue(this.value());

    if (this.controlContainer && this.controlContainer.control) {
      const parentControl = this.controlContainer.control as FormGroup;
      if (parentControl) {
        parentControl.addControl(fieldName, this.inputControl);
      }
    }
  }
}
