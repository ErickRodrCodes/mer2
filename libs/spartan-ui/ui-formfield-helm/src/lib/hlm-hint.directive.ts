import { Directive } from '@angular/core';

// class: SpartanUIFormFieldClassConfig.HlmHintDirectiveHostClass,
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-hint',
	standalone: true,
	host: {
    class: 'block text-xs text-muted-foreground',
	},
})
export class HlmHintDirective {}
