import { Directive, computed, input } from '@angular/core';
import { BrnAccordionItemDirective } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { AccordionConfigBase } from '@spartan-ui/config-adapter';

@Directive({
  selector: '[hlmAccordionItem],brn-accordion-item[hlm],hlm-accordion-item',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [
    {
      directive: BrnAccordionItemDirective,
      inputs: ['isOpened'],
    },
  ],
})
export class HlmAccordionItemDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(AccordionConfigBase.AccordionItemDirective, this.userClass())
  );
}
