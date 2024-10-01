import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerilManagementComponent } from './peril-management.component';

describe('PerilManagementComponent', () => {
  let component: PerilManagementComponent;
  let fixture: ComponentFixture<PerilManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerilManagementComponent]
    });
    fixture = TestBed.createComponent(PerilManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
