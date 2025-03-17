import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CptSelectDialogComponent } from './cpt-select-dialog.component';

describe('CptSelectDialogComponent', () => {
  let component: CptSelectDialogComponent;
  let fixture: ComponentFixture<CptSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CptSelectDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CptSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
