import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAdmissionComponent } from './claim-admission.component';

describe('ClaimAdmissionComponent', () => {
  let component: ClaimAdmissionComponent;
  let fixture: ComponentFixture<ClaimAdmissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimAdmissionComponent]
    });
    fixture = TestBed.createComponent(ClaimAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
