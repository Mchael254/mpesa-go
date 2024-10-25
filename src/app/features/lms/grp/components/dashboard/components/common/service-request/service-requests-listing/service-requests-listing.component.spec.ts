import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestsListingComponent } from './service-requests-listing.component';

describe('ServiceRequestsListingComponent', () => {
  let component: ServiceRequestsListingComponent;
  let fixture: ComponentFixture<ServiceRequestsListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRequestsListingComponent]
    });
    fixture = TestBed.createComponent(ServiceRequestsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
