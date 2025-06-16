import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerUIInputTextFieldComponent } from './ui-input-text-field.component';

describe('MerUIInputTextFieldComponent', () => {
  let component: MerUIInputTextFieldComponent;
  let fixture: ComponentFixture<MerUIInputTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerUIInputTextFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerUIInputTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
