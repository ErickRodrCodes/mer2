import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-radio-indicator',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
  template: `
    <div
      class="bg-foreground absolute inset-0 hidden scale-[55%] rounded-full group-[.brn-radio-checked]:inline-block"
    ></div>
    <div
      class="border-primary aspect-square rounded-full ring-offset-background group-[.cdk-keyboard-focused]:ring-2 group-[.cdk-keyboard-focused]:ring-ring group-[.cdk-keyboard-focused]:ring-offset-2 group-[.brn-radio-disabled]:cursor-not-allowed group-[.brn-radio-disabled]:opacity-50 rounded-full border"
    ></div>
  `,
})
export class HlmRadioIndicatorComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm('relative inline-flex h-4 w-4', this.userClass())
  );
}
