import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaShareSummaryComponent } from './quota-share-summary.component';

describe('QuotaShareSummaryComponent', () => {
  let component: QuotaShareSummaryComponent;
  let fixture: ComponentFixture<QuotaShareSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotaShareSummaryComponent]
    });
    fixture = TestBed.createComponent(QuotaShareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
