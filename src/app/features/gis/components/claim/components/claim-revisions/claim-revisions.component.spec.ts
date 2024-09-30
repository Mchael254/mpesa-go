import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRevisionsComponent } from './claim-revisions.component';

describe('ClaimRevisionsComponent', () => {
  let component: ClaimRevisionsComponent;
  let fixture: ComponentFixture<ClaimRevisionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimRevisionsComponent]
    });
    fixture = TestBed.createComponent(ClaimRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
