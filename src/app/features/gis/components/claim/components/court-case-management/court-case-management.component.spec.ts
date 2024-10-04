import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCaseManagementComponent } from './court-case-management.component';

describe('CourtCaseManagementComponent', () => {
  let component: CourtCaseManagementComponent;
  let fixture: ComponentFixture<CourtCaseManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourtCaseManagementComponent]
    });
    fixture = TestBed.createComponent(CourtCaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
