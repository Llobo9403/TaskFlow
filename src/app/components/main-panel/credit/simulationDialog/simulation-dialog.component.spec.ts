import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDialogComponent } from './simulation-dialog.component';

describe('SimulationDialogComponent', () => {
  let component: SimulationDialogComponent;
  let fixture: ComponentFixture<SimulationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
