import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ProtectedRouteConstants } from '@mer-ui/common';
import { SessionService } from '@mer/services';


@Component({
  selector: 'lib-mer-pages-daily-report-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-report-view.component.html',
  styleUrl: './daily-report-view.component.css',
})
export class MerPagesDailyReportViewComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  public readonly routes = ProtectedRouteConstants

  private readonly currentDate = new Date();
  private formatDateForRequest = signal(this.currentDate.toISOString().split('T')[0]);
  public readonly humanDate = signal(this.currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  public readonly techName = signal('');
  forms: WritableSignal<any[]> = signal([]);

  constructor() {
    effect(() => {
      if (this.formatDateForRequest()) {
        const isoDate = new Date(this.formatDateForRequest()).toISOString().split('T')[0];
        const humanDate = new Date(this.formatDateForRequest()).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        this.formatDateForRequest.set(isoDate);
        this.humanDate.set(humanDate);
      }
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private async fetchData() {
    try {
      const user = this.sessionService.userSessionData();
      const techCode = user.technicianCode;
      this.techName.set(`${user.technicianFirstName} ${user.technicianLastName}`);

      const {listIntakes} = await window.MedicalRecordAPI.getListsOfIntakesOfDay({
        technicianId: techCode,
        date: this.formatDateForRequest()
      });
      console.log({ listIntakes });
      const sortedIntakes = (listIntakes || []).sort((a: any, b: any) => (a.acNumber || '') > (b.acNumber || '') ? 1 : -1);
      this.forms.set(sortedIntakes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  format(date: string, formatStr: string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (formatStr === 'MM-dd-yyyy') {
      return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`;
    }
    return date;
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = input.value;
    this.formatDateForRequest.set(date);
    this.fetchData();
  }

  async billingSheetPrint(formId: string) {
    console.log({ formId });
    await window.PrinterPdfAPI.billingSheetPrint({
      PK_Intake: formId,
    })
  }

  editSurvey(formId: string) {
    const urlToNavigate = ProtectedRouteConstants.EDIT_BILLING_SHEET.substring(1).replace(':billing_sheet_id', formId);
    this.router.navigate([urlToNavigate]).then(() => {
      console.log('Navigated to edit billing sheet');
    }).catch((error) => {
      console.error('Error navigating to edit billing sheet:', error);
    });
  }


  async printDailyReport() {
    try {
      const user = this.sessionService.userSessionData();
      const response = await window.PrinterPdfAPI.printDailyLog({
        techCode: user.technicianCode || '',
        date: this.formatDateForRequest(),
      });
      console.log({ response });
    } catch (error) {
      console.error('Error printing report:', error);
    }
  }
}
