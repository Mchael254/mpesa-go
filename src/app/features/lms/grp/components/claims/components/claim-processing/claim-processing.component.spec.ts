import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimProcessingComponent } from './claim-processing.component';

describe('ClaimProcessingComponent', () => {
  let component: ClaimProcessingComponent;
  let fixture: ComponentFixture<ClaimProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimProcessingComponent]
    });
    fixture = TestBed.createComponent(ClaimProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
