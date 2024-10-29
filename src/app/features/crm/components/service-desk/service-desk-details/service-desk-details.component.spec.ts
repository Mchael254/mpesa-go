import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeskDetailsComponent } from './service-desk-details.component';

describe('ServiceDeskDetailsComponent', () => {
  let component: ServiceDeskDetailsComponent;
  let fixture: ComponentFixture<ServiceDeskDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDeskDetailsComponent]
    });
    fixture = TestBed.createComponent(ServiceDeskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
