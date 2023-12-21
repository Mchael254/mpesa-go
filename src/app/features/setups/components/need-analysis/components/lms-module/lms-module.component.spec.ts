import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsModuleComponent } from './lms-module.component';

describe('LmsModuleComponent', () => {
  let component: LmsModuleComponent;
  let fixture: ComponentFixture<LmsModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LmsModuleComponent]
    });
    fixture = TestBed.createComponent(LmsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
