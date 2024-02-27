import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariesDependentsComponent } from './beneficiaries-dependents.component';

describe('BeneficiariesDependentsComponent', () => {
  let component: BeneficiariesDependentsComponent;
  let fixture: ComponentFixture<BeneficiariesDependentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiariesDependentsComponent]
    });
    fixture = TestBed.createComponent(BeneficiariesDependentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
