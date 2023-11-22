import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityComponent } from './liability.component';

describe('LiabilityComponent', () => {
  let component: LiabilityComponent;
  let fixture: ComponentFixture<LiabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiabilityComponent]
    });
    fixture = TestBed.createComponent(LiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
