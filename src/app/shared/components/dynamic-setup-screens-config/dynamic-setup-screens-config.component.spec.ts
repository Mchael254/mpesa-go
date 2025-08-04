import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupScreensConfigComponent } from './dynamic-setup-screens-config.component';

describe('DynamicSetupScreensConfigComponent', () => {
  let component: DynamicSetupScreensConfigComponent;
  let fixture: ComponentFixture<DynamicSetupScreensConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSetupScreensConfigComponent]
    });
    fixture = TestBed.createComponent(DynamicSetupScreensConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
