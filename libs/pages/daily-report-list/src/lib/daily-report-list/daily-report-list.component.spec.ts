import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyReportListComponent } from './daily-report-list.component';

describe('DailyReportListComponent', () => {
  let component: DailyReportListComponent;
  let fixture: ComponentFixture<DailyReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
