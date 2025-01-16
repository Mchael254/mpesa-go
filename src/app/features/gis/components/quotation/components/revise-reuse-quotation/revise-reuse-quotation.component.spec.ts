import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviseReuseQuotationComponent } from './revise-reuse-quotation.component';

describe('ReviseReuseQuotationComponent', () => {
  let component: ReviseReuseQuotationComponent;
  let fixture: ComponentFixture<ReviseReuseQuotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviseReuseQuotationComponent]
    });
    fixture = TestBed.createComponent(ReviseReuseQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
