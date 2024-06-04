import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPensionSummaryComponent } from './admin-pension-summary.component';

describe('AdminPensionSummaryComponent', () => {
  let component: AdminPensionSummaryComponent;
  let fixture: ComponentFixture<AdminPensionSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPensionSummaryComponent]
    });
    fixture = TestBed.createComponent(AdminPensionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
