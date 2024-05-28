import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPolicyListingComponent } from './admin-policy-listing.component';

describe('AdminPolicyListingComponent', () => {
  let component: AdminPolicyListingComponent;
  let fixture: ComponentFixture<AdminPolicyListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPolicyListingComponent]
    });
    fixture = TestBed.createComponent(AdminPolicyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
