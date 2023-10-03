import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsClientDetailsComponent } from './quotations-client-details.component';

describe('QuotationsClientDetailsComponent', () => {
  let component: QuotationsClientDetailsComponent;
  let fixture: ComponentFixture<QuotationsClientDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationsClientDetailsComponent]
    });
    fixture = TestBed.createComponent(QuotationsClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
