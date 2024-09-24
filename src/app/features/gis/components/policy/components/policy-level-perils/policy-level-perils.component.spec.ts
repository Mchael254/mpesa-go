import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLevelPerilsComponent } from './policy-level-perils.component';

describe('PolicyLevelPerilsComponent', () => {
  let component: PolicyLevelPerilsComponent;
  let fixture: ComponentFixture<PolicyLevelPerilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyLevelPerilsComponent]
    });
    fixture = TestBed.createComponent(PolicyLevelPerilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
