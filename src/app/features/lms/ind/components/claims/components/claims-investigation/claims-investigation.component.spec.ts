import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsInvestigationComponent } from './claims-investigation.component';

describe('ClaimsInvestigationComponent', () => {
  let component: ClaimsInvestigationComponent;
  let fixture: ComponentFixture<ClaimsInvestigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsInvestigationComponent]
    });
    fixture = TestBed.createComponent(ClaimsInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
