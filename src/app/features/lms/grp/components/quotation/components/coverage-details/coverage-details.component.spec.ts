import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageDetailsComponent } from './coverage-details.component';

describe('CoverageDetailsComponent', () => {
  let component: CoverageDetailsComponent;
  let fixture: ComponentFixture<CoverageDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverageDetailsComponent]
    });
    fixture = TestBed.createComponent(CoverageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
