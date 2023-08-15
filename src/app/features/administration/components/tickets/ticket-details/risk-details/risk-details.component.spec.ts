import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDetailsComponent } from './risk-details.component';

describe('RiskDetailsComponent', () => {
  let component: RiskDetailsComponent;
  let fixture: ComponentFixture<RiskDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskDetailsComponent]
    });
    fixture = TestBed.createComponent(RiskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
