import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuouteSummaryComponent } from './quoute-summary.component';

describe('QuouteSummaryComponent', () => {
  let component: QuouteSummaryComponent;
  let fixture: ComponentFixture<QuouteSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuouteSummaryComponent]
    });
    fixture = TestBed.createComponent(QuouteSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
