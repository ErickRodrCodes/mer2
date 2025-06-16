import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesLoginComponent } from './login.component';

describe('MerPagesLoginComponent', () => {
  let component: MerPagesLoginComponent;
  let fixture: ComponentFixture<MerPagesLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
