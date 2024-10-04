import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDetailsComponent } from './claim-details.component';

describe('ClaimDetailsComponent', () => {
  let component: ClaimDetailsComponent;
  let fixture: ComponentFixture<ClaimDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimDetailsComponent]
    });
    fixture = TestBed.createComponent(ClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
