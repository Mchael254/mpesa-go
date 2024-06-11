import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalQuoteInitComponent } from './normal-quote-init.component';

describe('NormalQuoteInitComponent', () => {
  let component: NormalQuoteInitComponent;
  let fixture: ComponentFixture<NormalQuoteInitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalQuoteInitComponent]
    });
    fixture = TestBed.createComponent(NormalQuoteInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
