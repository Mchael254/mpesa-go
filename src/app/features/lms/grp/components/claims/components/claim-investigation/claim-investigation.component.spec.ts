import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimInvestigationComponent } from './claim-investigation.component';

describe('ClaimInvestigationComponent', () => {
  let component: ClaimInvestigationComponent;
  let fixture: ComponentFixture<ClaimInvestigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimInvestigationComponent]
    });
    fixture = TestBed.createComponent(ClaimInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
