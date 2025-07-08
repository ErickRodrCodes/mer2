import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MerUIPageWrapperComponent } from '@mer-ui/ui-page-wrapper';
import { SessionService } from '@mer/services';
import { MenuItemRoute } from '@mer/types';
import { commonRoutes } from './app.routes';

@Component({
  imports: [MerUIPageWrapperComponent, RouterModule],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  public items: WritableSignal<MenuItemRoute[]> = signal<MenuItemRoute[]>([]);
  public readonly sessionService: SessionService = inject(SessionService);

  ngOnInit() {
    this.setupSidebar();
  }

  constructor() {
    effect(() => {
      this.setupSidebar();
    });
  }

  public setupSidebar() {
    const itemsMenu: MenuItemRoute[] = [];
    const isLoggedIn = this.sessionService.userSessionData().isLoggedIn;
    if (isLoggedIn) {
      const findPrivateRoutes = commonRoutes.filter((item) => {
        if (item?.isPrivate) {
          return item;
        }
        return false;
      });
      itemsMenu.push(...findPrivateRoutes);
    } else {
      const findPublicRoutes = commonRoutes.filter((item) => {
        if (!item?.isPrivate) {
          return item;
        }
        return false;
      });
      itemsMenu.push(...findPublicRoutes);
    }

    this.items.set(
      itemsMenu.sort((a, b) => {
        if (a.order && b.order) {
          return a.order - b.order;
        }
        return 0;
      })
    );
  }
}
