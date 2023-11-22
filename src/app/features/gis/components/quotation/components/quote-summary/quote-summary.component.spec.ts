import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSummaryComponent } from './quote-summary.component';

describe('QuoteSummaryComponent', () => {
  let component: QuoteSummaryComponent;
  let fixture: ComponentFixture<QuoteSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteSummaryComponent]
    });
    fixture = TestBed.createComponent(QuoteSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
