import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { SpartanUIRadioGroupClassConfig } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio-indicator',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<div
			[attr.class]="spartanUIRadioGroupClassConfig.HlmRadioIndicatorComponentCheckedComputedClass"
		></div>
		<div [attr.class]="spartanUIRadioGroupClassConfig.HlmRadioIndicatorComponentBorderComputedClass"></div>
	`,
})
export class HlmRadioIndicatorComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(SpartanUIRadioGroupClassConfig.HlmRadioIndicatorComponentComputedClass, this.userClass()));
  public readonly spartanUIRadioGroupClassConfig = SpartanUIRadioGroupClassConfig;

}
