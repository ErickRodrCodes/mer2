import { Directive, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { provideHlmIconConfig } from '@spartan-ng/ui-icon-helm';
import { AccordionConfigBase } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'ng-icon[hlmAccordionIcon], ng-icon[hlmAccIcon]',
  standalone: true,
  providers: [
    provideIcons({ lucideChevronDown }),
    provideHlmIconConfig({ size: 'sm' }),
  ],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmAccordionIconDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(AccordionConfigBase.AccordionIconDirective, this.userClass())
  );
}
