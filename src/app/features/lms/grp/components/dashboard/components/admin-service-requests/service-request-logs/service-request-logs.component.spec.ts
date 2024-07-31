import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestLogsComponent } from './service-request-logs.component';

describe('ServiceRequestLogsComponent', () => {
  let component: ServiceRequestLogsComponent;
  let fixture: ComponentFixture<ServiceRequestLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceRequestLogsComponent]
    });
    fixture = TestBed.createComponent(ServiceRequestLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
