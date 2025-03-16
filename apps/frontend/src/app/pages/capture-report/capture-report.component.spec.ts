import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaptureReportComponent } from './capture-report.component';

describe('CaptureReportComponent', () => {
  let component: CaptureReportComponent;
  let fixture: ComponentFixture<CaptureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaptureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
