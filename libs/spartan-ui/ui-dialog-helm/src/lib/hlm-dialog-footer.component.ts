import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { SpartanUIDialogConfig } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-dialog-footer',
	standalone: true,
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmDialogFooterComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
      SpartanUIDialogConfig.HlmDialogFooterComponent_ComputedClass,
      this.userClass()
    )
	);
}
