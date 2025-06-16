import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogTitleDirective } from '@spartan-ng/brain/dialog';
import { SpartanUIDialogConfig } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDialogTitle]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnDialogTitleDirective],
})
export class HlmDialogTitleDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(
    SpartanUIDialogConfig.HlmDialogTitleDirective_ComputedClass,
    this.userClass()
  ));
}
