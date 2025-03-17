import { Directive, computed, inject, input } from '@angular/core';
import { BrnAccordionDirective } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/brain/core';
import { AccordionConfigBase } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmAccordion], hlm-accordion',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [
    {
      directive: BrnAccordionDirective,
      inputs: ['type', 'dir', 'orientation'],
    },
  ],
})
export class HlmAccordionDirective {
  private readonly _brn = inject(BrnAccordionDirective);

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      AccordionConfigBase.AccordionDirective,
      this._brn.orientation() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.userClass()
    )
  );
}
