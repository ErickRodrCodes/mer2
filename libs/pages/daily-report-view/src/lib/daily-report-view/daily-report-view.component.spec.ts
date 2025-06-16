import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesDailyReportViewComponent } from './daily-report-view.component';

describe('MerPagesDailyReportViewComponent', () => {
  let component: MerPagesDailyReportViewComponent;
  let fixture: ComponentFixture<MerPagesDailyReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesDailyReportViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesDailyReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
