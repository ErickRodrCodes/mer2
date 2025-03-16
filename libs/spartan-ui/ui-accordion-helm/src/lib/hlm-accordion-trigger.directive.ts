import { Directive, computed, input } from '@angular/core';
import { BrnAccordionTriggerDirective } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/brain/core';
import { AccordionConfigBase } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmAccordionTrigger]',
  standalone: true,
  host: {
    '[style.--tw-ring-offset-shadow]': '"0 0 #000"',
    '[class]': '_computedClass()',
  },
  hostDirectives: [BrnAccordionTriggerDirective],
})
export class HlmAccordionTriggerDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm(AccordionConfigBase.AccordionTriggerDirective, this.userClass())
  );
}
