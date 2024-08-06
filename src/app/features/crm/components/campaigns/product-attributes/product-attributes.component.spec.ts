import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributesComponent } from './product-attributes.component';

describe('ProductAttributesComponent', () => {
  let component: ProductAttributesComponent;
  let fixture: ComponentFixture<ProductAttributesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductAttributesComponent]
    });
    fixture = TestBed.createComponent(ProductAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
