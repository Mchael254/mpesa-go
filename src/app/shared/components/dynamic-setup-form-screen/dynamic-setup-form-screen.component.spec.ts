import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupFormScreenComponent } from './dynamic-setup-form-screen.component';

describe('DynamicSetupFormScreenComponent', () => {
  let component: DynamicSetupFormScreenComponent;
  let fixture: ComponentFixture<DynamicSetupFormScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSetupFormScreenComponent]
    });
    fixture = TestBed.createComponent(DynamicSetupFormScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
