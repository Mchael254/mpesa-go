import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionSummaryComponent } from './revision-summary.component';

describe('RevisionSummaryComponent', () => {
  let component: RevisionSummaryComponent;
  let fixture: ComponentFixture<RevisionSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionSummaryComponent]
    });
    fixture = TestBed.createComponent(RevisionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
