import { Directive } from '@angular/core';
// class: SpartanUIFormFieldClassConfig.HlmErrorDirectiveHostClass,
@Directive({
	standalone: true,
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-error',
	host: {
    class: 'block text-error text-xs font-medium',
	},
})
export class HlmErrorDirective {}
