import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceSelectionComponent } from './reinsurance-selection.component';

describe('ReinsuranceSelectionComponent', () => {
  let component: ReinsuranceSelectionComponent;
  let fixture: ComponentFixture<ReinsuranceSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReinsuranceSelectionComponent]
    });
    fixture = TestBed.createComponent(ReinsuranceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
