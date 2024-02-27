import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationLandingScreenComponent } from './quotation-landing-screen.component';

describe('QuotationLandingScreenComponent', () => {
  let component: QuotationLandingScreenComponent;
  let fixture: ComponentFixture<QuotationLandingScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationLandingScreenComponent]
    });
    fixture = TestBed.createComponent(QuotationLandingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
