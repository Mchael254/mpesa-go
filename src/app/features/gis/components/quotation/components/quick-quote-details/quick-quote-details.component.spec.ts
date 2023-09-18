import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickQuoteDetailsComponent } from './quick-quote-details.component';

describe('QuickQuoteDetailsComponent', () => {
  let component: QuickQuoteDetailsComponent;
  let fixture: ComponentFixture<QuickQuoteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickQuoteDetailsComponent]
    });
    fixture = TestBed.createComponent(QuickQuoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
