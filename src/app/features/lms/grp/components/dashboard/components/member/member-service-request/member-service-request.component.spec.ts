import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberServiceRequestComponent } from './member-service-request.component';

describe('MemberServiceRequestComponent', () => {
  let component: MemberServiceRequestComponent;
  let fixture: ComponentFixture<MemberServiceRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberServiceRequestComponent]
    });
    fixture = TestBed.createComponent(MemberServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
