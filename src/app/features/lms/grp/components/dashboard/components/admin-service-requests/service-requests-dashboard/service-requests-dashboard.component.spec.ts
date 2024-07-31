import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestsDashboardComponent } from './service-requests-dashboard.component';

describe('ServiceRequestsDashboardComponent', () => {
  let component: ServiceRequestsDashboardComponent;
  let fixture: ComponentFixture<ServiceRequestsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRequestsDashboardComponent]
    });
    fixture = TestBed.createComponent(ServiceRequestsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
