import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPolicyDetailsComponent } from './admin-policy-details.component';

describe('AdminPolicyDetailsComponent', () => {
  let component: AdminPolicyDetailsComponent;
  let fixture: ComponentFixture<AdminPolicyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPolicyDetailsComponent]
    });
    fixture = TestBed.createComponent(AdminPolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
