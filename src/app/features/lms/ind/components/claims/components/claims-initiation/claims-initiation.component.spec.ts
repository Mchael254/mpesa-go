import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsInitiationComponent } from './claims-initiation.component';

describe('ClaimComponent', () => {
  let component: ClaimsInitiationComponent;
  let fixture: ComponentFixture<ClaimsInitiationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsInitiationComponent]
    });
    fixture = TestBed.createComponent(ClaimsInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
