import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/brain/accordion';
imp;
import { hlm } from '@spartan-ng/brain/core';
import { AccordionConfigBase } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-accordion-content',
  template: `
    <div [attr.inert]="_addInert()" style="overflow: hidden">
      <p [class]="_contentClass()">
        <ng-content />
      </p>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmAccordionContentComponent extends BrnAccordionContentComponent {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => {
    const gridRows =
      this.state() === 'open' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
    return hlm(
      AccordionConfigBase.AccordionContentComponent,
      gridRows,
      this.userClass()
    );
  });

  constructor() {
    super();
    this.setClassToCustomElement('pt-1 pb-4');
  }
}
