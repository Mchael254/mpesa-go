import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCentreComponent } from './risk-centre.component';

describe('RiskCentreComponent', () => {
  let component: RiskCentreComponent;
  let fixture: ComponentFixture<RiskCentreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskCentreComponent]
    });
    fixture = TestBed.createComponent(RiskCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
