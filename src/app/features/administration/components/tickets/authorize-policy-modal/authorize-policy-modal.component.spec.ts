import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizePolicyModalComponent } from './authorize-policy-modal.component';

describe('AuthorizePolicyModalComponent', () => {
  let component: AuthorizePolicyModalComponent;
  let fixture: ComponentFixture<AuthorizePolicyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizePolicyModalComponent]
    });
    fixture = TestBed.createComponent(AuthorizePolicyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
