import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimOpeningComponent } from './claim-opening.component';

describe('ClaimOpeningComponent', () => {
  let component: ClaimOpeningComponent;
  let fixture: ComponentFixture<ClaimOpeningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimOpeningComponent]
    });
    fixture = TestBed.createComponent(ClaimOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
