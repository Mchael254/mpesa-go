import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthAmlComponent } from './wealth-aml.component';

describe('WealthAmlComponent', () => {
  let component: WealthAmlComponent;
  let fixture: ComponentFixture<WealthAmlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WealthAmlComponent]
    });
    fixture = TestBed.createComponent(WealthAmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
