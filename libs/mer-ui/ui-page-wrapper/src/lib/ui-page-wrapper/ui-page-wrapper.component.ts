import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  Renderer2,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuItemRoute } from '@mer/types';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { MerUIHeaderComponent } from '@mer-ui/ui-header';
@Component({
  selector: 'mer-ui-page-wrapper',
  imports: [RouterOutlet, RouterLink, MerUIHeaderComponent],
  templateUrl: './ui-page-wrapper.component.html',
  styleUrl: './ui-page-wrapper.component.scss',
})
export class MerUIPageWrapperComponent implements OnInit {
  public readonly drawerToggle = viewChild.required<HTMLInputElement>('drawerToggle');
  public activeRoute = inject(ActivatedRoute);
  public renderer = inject(Renderer2);
  public items: InputSignal<MenuItemRoute[]> =
    input.required<MenuItemRoute[]>();
  public readonly disableHeaderAndTheme: WritableSignal<boolean> =
    signal(false);
  public router = inject(Router);

  public toggleDrawer() {
    // research why is not closing with the viewChild
    document.getElementById('my-drawer')?.click();
  }
  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        // This gives you the full URL as a string
        const isPrint = this.router.url.split('/')[1].includes('print');
        this.disableHeaderAndTheme.set(isPrint);
      });
  }

}
