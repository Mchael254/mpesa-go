import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyProductComponent } from './policy-product.component';

describe('PolicyProductComponent', () => {
  let component: PolicyProductComponent;
  let fixture: ComponentFixture<PolicyProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyProductComponent]
    });
    fixture = TestBed.createComponent(PolicyProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
