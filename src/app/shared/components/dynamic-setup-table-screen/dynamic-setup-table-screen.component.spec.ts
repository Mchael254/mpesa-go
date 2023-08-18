import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupTableScreenComponent } from './dynamic-setup-table-screen.component';

describe('DynamicSetupTableScreenComponent', () => {
  let component: DynamicSetupTableScreenComponent;
  let fixture: ComponentFixture<DynamicSetupTableScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSetupTableScreenComponent]
    });
    fixture = TestBed.createComponent(DynamicSetupTableScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
