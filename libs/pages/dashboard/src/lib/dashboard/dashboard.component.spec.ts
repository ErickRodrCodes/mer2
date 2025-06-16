import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerPagesDashboardComponent } from './dashboard.component';

describe('MerPagesDashboardComponent', () => {
  let component: MerPagesDashboardComponent;
  let fixture: ComponentFixture<MerPagesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerPagesDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerPagesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
