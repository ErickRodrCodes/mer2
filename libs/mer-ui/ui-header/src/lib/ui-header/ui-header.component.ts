import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { SessionService } from '@mer/services';
import { LoggedUserInfo } from '@mer/types';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mer-ui-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './ui-header.component.html',
  styleUrl: './ui-header.component.scss',
})
export class MerUIHeaderComponent {
  public readonly sessionService = inject(SessionService);
  public readonly userInfo: WritableSignal<LoggedUserInfo> = signal({
    technicianFirstName: null,
    technicianLastName: null,
    technicianCode: '',
    isLoggedIn: false,
  });

  constructor() {
    effect(() => {
      this.userInfo.set(this.sessionService.userSessionData());
    });
  }
}
