import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedAnalysisComponent } from './need-analysis.component';

describe('NeedAnalysisComponent', () => {
  let component: NeedAnalysisComponent;
  let fixture: ComponentFixture<NeedAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeedAnalysisComponent]
    });
    fixture = TestBed.createComponent(NeedAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
