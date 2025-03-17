import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInputTypeaheadFieldComponent } from './ui-input-typeahead-field.component';

describe('UiInputTypeaheadFieldComponent', () => {
  let component: UiInputTypeaheadFieldComponent;
  let fixture: ComponentFixture<UiInputTypeaheadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputTypeaheadFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiInputTypeaheadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
