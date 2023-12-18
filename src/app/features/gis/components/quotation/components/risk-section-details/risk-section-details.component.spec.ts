import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSectionDetailsComponent } from './risk-section-details.component';

describe('RiskSectionDetailsComponent', () => {
  let component: RiskSectionDetailsComponent;
  let fixture: ComponentFixture<RiskSectionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskSectionDetailsComponent]
    });
    fixture = TestBed.createComponent(RiskSectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
