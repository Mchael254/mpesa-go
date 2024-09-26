import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTaxesComponent } from './policy-taxes.component';

describe('PolicyTaxesComponent', () => {
  let component: PolicyTaxesComponent;
  let fixture: ComponentFixture<PolicyTaxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyTaxesComponent]
    });
    fixture = TestBed.createComponent(PolicyTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
