import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import {
  BrnDialogCloseDirective,
  BrnDialogRef,
  injectBrnDialogContext,
} from '@spartan-ng/brain/dialog';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { SpartanUIDialogConfig } from '@spartan-ui/config-adapter';
import type { ClassValue } from 'clsx';
import { HlmDialogCloseDirective } from './hlm-dialog-close.directive';
@Component({
  selector: 'hlm-dialog-content',
  imports: [
    NgComponentOutlet,
    BrnDialogCloseDirective,
    HlmDialogCloseDirective,
    NgIcon,
    HlmIconDirective,
  ],
  providers: [provideIcons({ lucideX })],
  host: {
    '[class]': '_computedClass()',
    '[attr.data-state]': 'state()',
  },
  template: `
    @if (component) {
    <ng-container [ngComponentOutlet]="component" />
    } @else {
    <ng-content />
    }

    <button brnDialogClose hlm>
      <span class="sr-only">Close</span>
      <ng-icon hlm size="sm" name="lucideX" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HlmDialogContentComponent {
  private readonly _dialogRef = inject(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext({ optional: true });

  public readonly state = computed(() => this._dialogRef?.state() ?? 'closed');

  public readonly component = this._dialogContext?.$component;
  private readonly _dynamicComponentClass =
    this._dialogContext?.$dynamicComponentClass;

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      SpartanUIDialogConfig.HlmDialogContent_ComputedClass,
      this.userClass(),
      this._dynamicComponentClass
    )
  );
}
