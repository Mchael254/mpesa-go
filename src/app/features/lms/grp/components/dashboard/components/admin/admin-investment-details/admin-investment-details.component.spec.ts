import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestmentDetailsComponent } from './admin-investment-details.component';

describe('AdminInvestmentDetailsComponent', () => {
  let component: AdminInvestmentDetailsComponent;
  let fixture: ComponentFixture<AdminInvestmentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInvestmentDetailsComponent]
    });
    fixture = TestBed.createComponent(AdminInvestmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
