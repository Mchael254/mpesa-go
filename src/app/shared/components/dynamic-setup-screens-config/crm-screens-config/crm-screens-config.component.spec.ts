import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmScreensConfigComponent } from './crm-screens-config.component';

describe('CrmScreensConfigComponent', () => {
  let component: CrmScreensConfigComponent;
  let fixture: ComponentFixture<CrmScreensConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrmScreensConfigComponent]
    });
    fixture = TestBed.createComponent(CrmScreensConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
