import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPensionListingComponent } from './admin-pension-listing.component';

describe('AdminPensionListingComponent', () => {
  let component: AdminPensionListingComponent;
  let fixture: ComponentFixture<AdminPensionListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPensionListingComponent]
    });
    fixture = TestBed.createComponent(AdminPensionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
