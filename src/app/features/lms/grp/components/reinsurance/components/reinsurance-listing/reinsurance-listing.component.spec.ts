import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceListingComponent } from './reinsurance-listing.component';

describe('ReinsuranceListingComponent', () => {
  let component: ReinsuranceListingComponent;
  let fixture: ComponentFixture<ReinsuranceListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReinsuranceListingComponent]
    });
    fixture = TestBed.createComponent(ReinsuranceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
