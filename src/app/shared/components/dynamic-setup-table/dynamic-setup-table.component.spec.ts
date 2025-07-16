import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupTableComponent } from './dynamic-setup-table.component';

describe('DynamicSetupTableComponent', () => {
  let component: DynamicSetupTableComponent;
  let fixture: ComponentFixture<DynamicSetupTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSetupTableComponent]
    });
    fixture = TestBed.createComponent(DynamicSetupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
