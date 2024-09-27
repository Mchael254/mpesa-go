import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteMenuBarComponent } from './quote-menu-bar.component';

describe('QuoteMenuBarComponent', () => {
  let component: QuoteMenuBarComponent;
  let fixture: ComponentFixture<QuoteMenuBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteMenuBarComponent]
    });
    fixture = TestBed.createComponent(QuoteMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
