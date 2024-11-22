import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTypesComparisonComponent } from './cover-types-comparison.component';

describe('CoverTypesComparisonComponent', () => {
  let component: CoverTypesComparisonComponent;
  let fixture: ComponentFixture<CoverTypesComparisonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverTypesComparisonComponent]
    });
    fixture = TestBed.createComponent(CoverTypesComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
