import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHistoryComponent } from './insurance-history.component';

describe('InsuranceHistoryComponent', () => {
  let component: InsuranceHistoryComponent;
  let fixture: ComponentFixture<InsuranceHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceHistoryComponent]
    });
    fixture = TestBed.createComponent(InsuranceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
