import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimInitiationComponent } from './claim-initiation.component';

describe('ClaimInitiationComponent', () => {
  let component: ClaimInitiationComponent;
  let fixture: ComponentFixture<ClaimInitiationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimInitiationComponent]
    });
    fixture = TestBed.createComponent(ClaimInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
