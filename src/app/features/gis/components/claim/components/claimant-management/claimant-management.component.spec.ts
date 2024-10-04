import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimantManagementComponent } from './claimant-management.component';

describe('ClaimantManagementComponent', () => {
  let component: ClaimantManagementComponent;
  let fixture: ComponentFixture<ClaimantManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimantManagementComponent]
    });
    fixture = TestBed.createComponent(ClaimantManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
