import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeTransactionsComponent } from './view-employee-transactions.component';

describe('ViewEmployeeTransactionsComponent', () => {
  let component: ViewEmployeeTransactionsComponent;
  let fixture: ComponentFixture<ViewEmployeeTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEmployeeTransactionsComponent]
    });
    fixture = TestBed.createComponent(ViewEmployeeTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
