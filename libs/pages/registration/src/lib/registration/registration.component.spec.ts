import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesRegistrationComponent } from './registration.component';

describe('MerPagesRegistrationComponent', () => {
  let component: MerPagesRegistrationComponent;
  let fixture: ComponentFixture<MerPagesRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesRegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
