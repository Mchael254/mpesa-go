import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingDashboardComponent } from './banking-dashboard.component';

describe('BankingProcessComponent', () => {
  let component: BankingDashboardComponent;
  let fixture: ComponentFixture<BankingDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankingDashboardComponent]
    });
    fixture = TestBed.createComponent(BankingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
