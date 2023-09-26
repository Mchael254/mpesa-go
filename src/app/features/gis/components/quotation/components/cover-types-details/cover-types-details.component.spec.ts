import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTypesDetailsComponent } from './cover-types-details.component';

describe('CoverTypesDetailsComponent', () => {
  let component: CoverTypesDetailsComponent;
  let fixture: ComponentFixture<CoverTypesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverTypesDetailsComponent]
    });
    fixture = TestBed.createComponent(CoverTypesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
