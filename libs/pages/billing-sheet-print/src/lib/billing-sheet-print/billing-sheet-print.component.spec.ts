import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesBillingSheetPrintComponent } from './billing-sheet-print.component';

describe('MerPagesBillingSheetPrintComponent', () => {
  let component: MerPagesBillingSheetPrintComponent;
  let fixture: ComponentFixture<MerPagesBillingSheetPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesBillingSheetPrintComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesBillingSheetPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
