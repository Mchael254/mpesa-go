import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimantDetailsComponent } from './claimant-details.component';

describe('ClaimantDetailsComponent', () => {
  let component: ClaimantDetailsComponent;
  let fixture: ComponentFixture<ClaimantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimantDetailsComponent]
    });
    fixture = TestBed.createComponent(ClaimantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
