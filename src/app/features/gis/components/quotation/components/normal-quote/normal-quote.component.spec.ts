import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalQuoteComponent } from './normal-quote.component';

describe('NormalQuoteComponent', () => {
  let component: NormalQuoteComponent;
  let fixture: ComponentFixture<NormalQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalQuoteComponent]
    });
    fixture = TestBed.createComponent(NormalQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
