import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtectedRouteConstants } from '@mer-ui/common';
import { SessionService } from '@mer/services';
import { format as formatDateFns, parse } from 'date-fns';

@Component({
  selector: 'lib-mer-pages-daily-report-print',
  imports: [CommonModule],
  templateUrl: './daily-report-print.component.html',
  styleUrl: './daily-report-print.component.css',
})
export class MerPagesDailyReportPrintComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  public readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly routes = ProtectedRouteConstants
  public readonly technicianId = signal('');


  private readonly currentDate = new Date();
  private formatDateForRequest = signal('');
  public readonly humanDate = signal('');
  public readonly techName = signal('');
  forms: WritableSignal<any[]> = signal([]);


  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      const { date, technician_id } = params;
      this.technicianId.set(technician_id);
      this.formatDateForRequest.set(date);
      this.techName.set(`${technician_id}`);

      // Parse the date string as local date using date-fns
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
      const humanDate = formatDateFns(parsedDate, 'EEEE, MMMM d, yyyy');
      this.humanDate.set(humanDate);


      this.fetchData();
    });
  }

  private async fetchData() {
    try {
      const getTechnicianName = await window.MedicalRecordAPI.getTechnicianNameByCode(this.technicianId());
      const technicianName = getTechnicianName[0];
      this.techName.set(`${technicianName.technicianFirstName} ${technicianName.technicianLastName}`);

      const {listIntakes} = await window.MedicalRecordAPI.getListsOfIntakesOfDay({
        technicianId: this.techName(),
        date: this.formatDateForRequest()
      });

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

  async printDailyReport() {
    try {
      const user = this.sessionService.userSessionData();
      const response = await window.PrinterPdfAPI.printDailyLog({
        techCode: user.technicianCode || '',
        date: this.formatDateForRequest(),
      });
    } catch (error) {
      console.error('Error printing report:', error);
    }
  }
}
