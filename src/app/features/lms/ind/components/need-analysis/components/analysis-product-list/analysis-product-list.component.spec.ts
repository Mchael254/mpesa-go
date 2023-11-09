import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisProductListComponent } from './analysis-product-list.component';

describe('AnalysisProductListComponent', () => {
  let component: AnalysisProductListComponent;
  let fixture: ComponentFixture<AnalysisProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisProductListComponent]
    });
    fixture = TestBed.createComponent(AnalysisProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
