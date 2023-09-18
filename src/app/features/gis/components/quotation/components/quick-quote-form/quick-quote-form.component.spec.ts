import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickQuoteFormComponent } from './quick-quote-form.component';

describe('QuickQuoteFormComponent', () => {
  let component: QuickQuoteFormComponent;
  let fixture: ComponentFixture<QuickQuoteFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickQuoteFormComponent]
    });
    fixture = TestBed.createComponent(QuickQuoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
