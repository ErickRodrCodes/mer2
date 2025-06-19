import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  forwardRef,
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
  Validators
} from '@angular/forms';
import { ValidationRules } from '@mer-ui/ui-input-text-field';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { RadioPillControlType } from '../types/types';

@Component({

  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mer-radio-group',
  imports: [CommonModule, ReactiveFormsModule, HlmFormFieldModule, HlmInputDirective],
  templateUrl: './ui-radio-group.component.html',
  styleUrl: './ui-radio-group.component.css',
  standalone: true,
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MerUiRadioGroupComponent),
      multi: true,
    },
  ],
})
export class MerUiRadioGroupComponent implements OnInit {
  private controlContainer: ControlContainer | null = null;

  public fieldDefinition = input.required<RadioPillControlType>();
  public value = input<string | number | null>('');
  public layout = computed(() => this.fieldDefinition().layout || 'horizontal');

  public readonly id = computed(() => this.fieldDefinition().name || '');
  public readonly label = computed(() => this.fieldDefinition().label || '');
  public readonly options = computed(() => this.fieldDefinition().options || []);
  public readonly defaultValue = computed(() => this.fieldDefinition().defaultValue ?? '');
  public readonly hidden = computed(() => false); // Add hidden if needed in type
  public readonly validationRules = computed(() => (this.fieldDefinition() as any).validationRules || {});
  public readonly keyValue = computed(
    () => this.fieldDefinition().keyValue || ''
  );

  public readonly errorMessage = signal<string>('');
  public readonly hasError = signal(false);
  public readonly touched = signal(false);
  public readonly disabled = signal(false);

  public readonly inputControl: FormControl = new FormControl('');
  public readonly asyncValidationPending = signal(false);

  constructor(private injector: Injector) {
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
      this.inputControl.statusChanges.subscribe(() => {
        this.asyncValidationPending.set(this.inputControl.pending);
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

  private transformValidationRules(rules?: ValidationRules): {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
  } {
    const validators: ValidatorFn[] = [];
    const asyncValidators: AsyncValidatorFn[] = [];

    if (!rules) return { validators, asyncValidators };

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
    if (rules.asyncValidators && rules.asyncValidators.length > 0) {
      rules.asyncValidators.forEach((asyncValidator: any) => {
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
    const keys = Object.keys(validationRules).map((key) => key.toLowerCase());
    if (keys.includes(errorKey.toLowerCase())) {
      const rule = validationRules[errorKey as keyof ValidationRules];
      if (rule && 'message' in rule) {
        return rule.message || '';
      } else if (
        Array.isArray(rule) &&
        rule.length > 0 &&
        'message' in rule[0]
      ) {
        return rule[0].message || '';
      }
    }
    const findAsyncValidator = validationRules.asyncValidators?.find(
      (validator: { value: string }) => validator?.value === errorKey
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

  public onClickEvent($event: Event): void {
    // For radio group, set value from event target
    const value = ($event.target as HTMLInputElement).value;
    this.inputControl.setValue(value);
    this.inputControl.markAsDirty();
  }

  ngOnInit(): void {
    const fieldName = this.fieldDefinition().name;
    this.inputControl.setValue(this.value() ?? this.defaultValue());
    if (this.controlContainer && this.controlContainer.control) {
      const parentControl = this.controlContainer.control as FormGroup;
      if (parentControl) {
        parentControl.addControl(fieldName, this.inputControl);
      }
    }
  }
}

