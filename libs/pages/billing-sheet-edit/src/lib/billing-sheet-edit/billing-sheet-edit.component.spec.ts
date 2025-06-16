import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesBillingSheetEditComponent } from './billing-sheet-edit.component';

describe('MerPagesBillingSheetEditComponent', () => {
  let component: MerPagesBillingSheetEditComponent;
  let fixture: ComponentFixture<MerPagesBillingSheetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesBillingSheetEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesBillingSheetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
