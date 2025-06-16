import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerUIPageWrapperComponent } from './ui-page-wrapper.component';

describe('MerUIPageWrapperComponent', () => {
  let component: MerUIPageWrapperComponent;
  let fixture: ComponentFixture<MerUIPageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerUIPageWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerUIPageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
