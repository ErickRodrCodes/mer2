import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerUIHeaderComponent } from './ui-header.component';

describe('MerUIHeaderComponent', () => {
  let component: MerUIHeaderComponent;
  let fixture: ComponentFixture<MerUIHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerUIHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerUIHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
