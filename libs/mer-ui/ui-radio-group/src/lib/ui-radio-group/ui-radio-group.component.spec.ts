import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiRadioGroupComponent } from './ui-radio-group.component';

describe('UiRadioGroupComponent', () => {
  let component: UiRadioGroupComponent;
  let fixture: ComponentFixture<UiRadioGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiRadioGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
