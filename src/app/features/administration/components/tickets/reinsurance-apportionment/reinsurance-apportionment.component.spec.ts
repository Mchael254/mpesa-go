import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceApportionmentComponent } from './reinsurance-apportionment.component';

describe('ReinsuranceApportionmentComponent', () => {
  let component: ReinsuranceApportionmentComponent;
  let fixture: ComponentFixture<ReinsuranceApportionmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReinsuranceApportionmentComponent]
    });
    fixture = TestBed.createComponent(ReinsuranceApportionmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
