import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesDailyReportPrintComponent } from './daily-report-print.component';

describe('MerPagesDailyReportPrintComponent', () => {
  let component: MerPagesDailyReportPrintComponent;
  let fixture: ComponentFixture<MerPagesDailyReportPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesDailyReportPrintComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesDailyReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
