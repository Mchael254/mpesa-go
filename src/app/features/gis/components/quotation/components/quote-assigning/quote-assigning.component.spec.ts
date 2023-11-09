import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAssigningComponent } from './quote-assigning.component';

describe('QuoteAssigningComponent', () => {
  let component: QuoteAssigningComponent;
  let fixture: ComponentFixture<QuoteAssigningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteAssigningComponent]
    });
    fixture = TestBed.createComponent(QuoteAssigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
