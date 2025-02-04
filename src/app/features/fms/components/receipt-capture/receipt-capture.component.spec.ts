import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptCaptureComponent } from './receipt-capture.component';

describe('ReceiptCaptureComponent', () => {
  let component: ReceiptCaptureComponent;
  let fixture: ComponentFixture<ReceiptCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptCaptureComponent]
    });
    fixture = TestBed.createComponent(ReceiptCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
