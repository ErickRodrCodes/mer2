import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { format, parseISO } from 'date-fns';

import { ProtectedRouteConstants } from '@mer-ui/common';
import { IpcMainService, SessionService } from '@mer/services';

@Component({
  selector: 'lib-mer-pages-daily-report-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [IpcMainService],
  templateUrl: './daily-report-view.component.html',
  styleUrl: './daily-report-view.component.css',
})
export class MerPagesDailyReportViewComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  public readonly routes = ProtectedRouteConstants;

  private currentDate: Date = new Date();
  private formatDateForRequest = signal(
    this.currentDate.toISOString().split('T')[0]
  );
  public readonly humanDate = signal('');
  public readonly techName = signal('');
  public readonly forms: WritableSignal<any[]> = signal([]);

  public ipcMainService = inject(IpcMainService);

  constructor() {
    this.initializeDate();

    effect(() => {
      if (this.formatDateForRequest()) {
        console.log({
          currentDate: this.formatDateForRequest(),
          formatDateForRequest: new Date(
            this.formatDateForRequest()
          ).toISOString(),
        });

        this.humanDate.set(
          new Date(this.formatDateForRequest()).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'GMT',
          })
        );
      }
    });
  }

  private async initializeDate() {
    const rightTodayDate = await this.ipcMainService.getRightTodayDate();
    console.log({ rightTodayDate });
    this.currentDate = new Date(rightTodayDate);
    this.formatDateForRequest.set(this.currentDate.toISOString().split('T')[0]);
    this.humanDate.set(format(this.currentDate, 'EEEE, MMMM d, yyyy'));
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private async fetchData() {
    try {
      const user = this.sessionService.userSessionData();
      this.techName.set(
        `${user.technicianFirstName} ${user.technicianLastName}`
      );

      const { listIntakes } = await this.ipcMainService.getListsOfIntakesOfDay({
        technicianId: this.techName(),
        date: this.formatDateForRequest(),
      });
      console.log({ listIntakes });
      const sortedIntakes = (listIntakes || []).sort((a: any, b: any) =>
        (a.acNumber || '') > (b.acNumber || '') ? 1 : -1
      );
      this.forms.set(sortedIntakes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  DOBTransform(date: string) {
    console.log({ dateTransform: date });
    const arr = date.split('-');
    const year = arr[2];
    const month = arr[0];
    const day = arr[1];
    return `${year}-${month}-${day}`;
  }

  format(date: string, formatStr: string): string {
    if (!date) return 'N/A';
    console.log({ raw: date, date: parseISO(date) });
    return parseISO(date).toLocaleDateString();
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = input.value;
    this.formatDateForRequest.set(date);
    this.fetchData();
  }

  async billingSheetPrint(formId: string) {
    console.log({ formId });
    await this.ipcMainService.billingSheetPrint({
      PK_Intake: formId,
    });
  }

  editSurvey(formId: string) {
    const urlToNavigate = ProtectedRouteConstants.EDIT_BILLING_SHEET.substring(
      1
    ).replace(':billing_sheet_id', formId);
    this.router
      .navigate([urlToNavigate])
      .then(() => {
        console.log('Navigated to edit billing sheet');
      })
      .catch((error) => {
        console.error('Error navigating to edit billing sheet:', error);
      });
  }

  async printDailyReport() {
    try {
      const user = this.sessionService.userSessionData();
      const response = await this.ipcMainService.printDailyLog({
        techCode: user.technicianCode || '',
        date: this.formatDateForRequest(),
      });
      console.log({ response });
    } catch (error) {
      console.error('Error printing report:', error);
    }
  }
}
