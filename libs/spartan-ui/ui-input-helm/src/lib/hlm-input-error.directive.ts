import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { SpartanUIInputClassConfig } from '@spartan-ui/config-adapter';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputErrorVariants = cva(SpartanUIInputClassConfig.HlmInputErrorDirectiveVariantsClasses, {
	variants: {},
	defaultVariants: {},
});
export type InputErrorVariants = VariantProps<typeof inputErrorVariants>;

@Directive({
	selector: '[hlmInputError]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputErrorDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(inputErrorVariants(), this.userClass()));
}
