import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProtectedRouteConstants } from '@mer-ui/common';
@Component({
  selector: 'lib-mer-pages-dashboard',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class MerPagesDashboardComponent {
  public readonly protectedRouteConstants = ProtectedRouteConstants;
}
