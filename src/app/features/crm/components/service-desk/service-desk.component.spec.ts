import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeskComponent } from './service-desk.component';

describe('ServiceDeskComponent', () => {
  let component: ServiceDeskComponent;
  let fixture: ComponentFixture<ServiceDeskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDeskComponent]
    });
    fixture = TestBed.createComponent(ServiceDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
