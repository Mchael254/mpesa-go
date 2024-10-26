import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturitiesSelectionComponent } from './maturities-selection.component';

describe('MaturitiesSelectionComponent', () => {
  let component: MaturitiesSelectionComponent;
  let fixture: ComponentFixture<MaturitiesSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaturitiesSelectionComponent]
    });
    fixture = TestBed.createComponent(MaturitiesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
