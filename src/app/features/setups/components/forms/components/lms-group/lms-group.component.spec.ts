import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsGroupComponent } from './lms-group.component';

describe('LmsGroupComponent', () => {
  let component: LmsGroupComponent;
  let fixture: ComponentFixture<LmsGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LmsGroupComponent]
    });
    fixture = TestBed.createComponent(LmsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
