import {
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  output,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { HlmErrorDirective } from './hlm-error.directive';

// class: SpartanUIFormFieldClassConfig.HlmFormFieldComponentHostClass,
@Component({
  selector: 'hlm-form-field',
  template: `
    <ng-content></ng-content>

    @switch (hasDisplayedMessage()) { @case ('error') {
    <ng-content select="hlm-error"></ng-content>
    } @default {
    <ng-content select="hlm-hint"></ng-content>
    } }
  `,
  standalone: true,
  host: {
    class: 'text-sm w-full',
  },
})
export class HlmFormFieldComponent {
  public readonly control = contentChild(BrnFormFieldControl);

  public diplayErrorMessage = output<{
    isError: boolean;
    errors: ValidationErrors | null | undefined;
  }>();

  public readonly errorChildren = contentChildren(HlmErrorDirective);

  protected readonly hasDisplayedMessage = computed<'error' | 'hint'>(() => {
    const result =
      this.errorChildren() &&
      this.errorChildren().length > 0 &&
      this.control()?.errorState()
        ? 'error'
        : 'hint';
    this.diplayErrorMessage.emit({
      isError: result === 'error',
      errors: this.control()?.ngControl?.errors,
    });
    return result;
  });

  constructor() {
    effect(() => {
      if (!this.control()) {
        throw new Error('hlm-form-field must contain a BrnFormFieldControl.');
      }
    });
  }
}