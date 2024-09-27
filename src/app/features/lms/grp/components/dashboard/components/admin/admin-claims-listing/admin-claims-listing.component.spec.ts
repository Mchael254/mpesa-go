import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClaimsListingComponent } from './admin-claims-listing.component';

describe('AdminClaimsListingComponent', () => {
  let component: AdminClaimsListingComponent;
  let fixture: ComponentFixture<AdminClaimsListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminClaimsListingComponent]
    });
    fixture = TestBed.createComponent(AdminClaimsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
