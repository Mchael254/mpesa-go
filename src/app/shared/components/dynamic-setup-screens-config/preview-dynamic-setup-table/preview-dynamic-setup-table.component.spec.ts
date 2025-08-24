import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDynamicSetupTableComponent } from './preview-dynamic-setup-table.component';

describe('PreviewDynamicSetupTableComponent', () => {
  let component: PreviewDynamicSetupTableComponent;
  let fixture: ComponentFixture<PreviewDynamicSetupTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewDynamicSetupTableComponent]
    });
    fixture = TestBed.createComponent(PreviewDynamicSetupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
