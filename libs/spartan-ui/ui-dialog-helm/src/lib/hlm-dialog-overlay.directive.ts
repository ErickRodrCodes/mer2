import { Directive, computed, effect, input, untracked } from '@angular/core';
import { hlm, injectCustomClassSettable } from '@spartan-ng/brain/core';
import { SpartanUIDialogConfig } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';


@Directive({
	selector: '[hlmDialogOverlay],brn-dialog-overlay[hlm]',
	standalone: true,
})
export class HlmDialogOverlayDirective {
	private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(
    SpartanUIDialogConfig.HlmDialogOverlayDirective_ComputedClass,
    this.userClass()
  ));

	constructor() {
		effect(() => {
			const newClass = this._computedClass();
			untracked(() => this._classSettable?.setClassToCustomElement(newClass));
		});
	}
}
