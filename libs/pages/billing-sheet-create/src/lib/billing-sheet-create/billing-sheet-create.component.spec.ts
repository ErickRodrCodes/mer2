import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesBillingSheetCreateComponent } from './billing-sheet-create.component';

describe('MerPagesBillingSheetCreateComponent', () => {
  let component: MerPagesBillingSheetCreateComponent;
  let fixture: ComponentFixture<MerPagesBillingSheetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesBillingSheetCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesBillingSheetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
