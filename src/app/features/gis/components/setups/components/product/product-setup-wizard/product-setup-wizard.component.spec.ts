import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetupWizardComponent } from './product-setup-wizard.component';

describe('ProductSetupWizardComponent', () => {
  let component: ProductSetupWizardComponent;
  let fixture: ComponentFixture<ProductSetupWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSetupWizardComponent]
    });
    fixture = TestBed.createComponent(ProductSetupWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
